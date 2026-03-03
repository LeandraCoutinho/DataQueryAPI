import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { env } from "../env";
import { pipeline } from "@xenova/transformers";

const extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

export class LocalHFEmbeddings {
  async embedQuery(text: string): Promise<number[]> {
    const extractor = await extractorPromise;
    const output: any = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data) as number[];
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    const extractor = await extractorPromise;
    const out: number[][] = [];
    for (const t of texts) {
      const output: any = await extractor(t, { pooling: "mean", normalize: true });
      out.push(Array.from(output.data) as number[]);
    }
    return out;
  }
}

export async function answerWithRAG(rawData: any[], question: string) {
  const rawText = rawData
    .map((row, i) => `Registro ${i + 1}: ${JSON.stringify(row)}`)
    .join("\n\n");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.splitDocuments([
    new Document({ pageContent: rawText }),
  ]);

  const embeddings = new LocalHFEmbeddings();
  const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorstore.asRetriever();

  const llm = new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const results = await retriever.invoke(question);
  const context = results.map((r) => r.pageContent).join("\n");

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "Você é um assistente especialista que responde perguntas com base estritamente nos dados fornecidos. Se a resposta não estiver nos dados, diga 'Não encontrei informações sobre isso nos dados fornecidos.'. Caso não encontre uma resposta desejada, não precisa responder com uma mensagem positiva."],
    ["human", `Com base nos dados abaixo, responda a pergunta do usuário. 
    
    Dados:
    ---
    {context}
    ---
    
    Pergunta: {question}`],
  ]);

  const chain = promptTemplate.pipe(llm);

  const response = await chain.invoke({
    context: context,
    question: question,
  });

  return response.content;
}