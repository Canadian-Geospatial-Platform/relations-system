import connectToDatabase from "../../utils/db";

export async function docs() {
  const { ModelDocs } = await connectToDatabase();
  console.log("Connection successful.");

  return {
    statusCode: 200,
    body: ModelDocs
  };
}

export default { docs };
