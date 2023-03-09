import { fetchNotes } from "../../helpers/elastic-util";

export default async function handler(req, res) {
  const { searchString } = req.body;

  const result = await fetchNotes(searchString);

  res.status(200).json(result);
}
