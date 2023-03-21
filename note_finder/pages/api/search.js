import { fetchNotes } from "../../helpers/elastic-util";

export default async function handler(req, res) {
  const { searchString, fileType } = req.body;

  const result = await fetchNotes(searchString, fileType);

  res.status(200).json(result);
}
