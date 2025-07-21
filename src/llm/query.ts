import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { env } from "../env";

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

  const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: env.HUGGINGFACE_API_KEY,
    model: "sentence-transformers/all-MiniLM-L6-v2",
  });

  const vectorstore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const retriever = vectorstore.asRetriever();

  const llm = new ChatGroq({
    apiKey: env.GROQ_API_KEY,
    model: "llama3-70b-8192",
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