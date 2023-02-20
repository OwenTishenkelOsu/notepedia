import {getElasticNoteById} from '../../helpers/elastic-util'

export default async function handler(req, res) {

  const {note_id} = req.body;
  
  const result = await getElasticNoteById(note_id);

  res.status(200).json(result);

}
