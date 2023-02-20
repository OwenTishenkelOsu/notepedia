import {fetchNotes} from '../../helpers/elastic-util'

export default async function handler(req, res) {

  const {searchTerm, fileType} = req.body;
  
  const result = await fetchNotes(searchTerm, fileType);

  res.status(200).json(result);

}
