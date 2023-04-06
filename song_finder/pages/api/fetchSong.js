import {getElasticsongById} from '../../helpers/elastic-util'

export default async function handler(req, res) {

  const {song_id} = req.body;
  
  const result = await getElasticsongById(song_id);

  res.status(200).json(result);

}
