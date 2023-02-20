//  this is the page that is rendered when a user clicks on a note

import {getAllNotes, getElasticNoteById} from '../../helpers/elastic-util';

export default function NotePage({ note }) {

    const sourceData = note._source;

    // return a pretty page with the doctype, title, text, and upload date of the note
    return (
        <div>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',

                // make this a card
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',

            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',


                }}>
                    <h1>Note Title: {sourceData.title}</h1>
                    <div style={{
                        // add a little padding to the text
                        padding: '10px',
                    }}>
                        <p> <strong>File Type:</strong> {sourceData.doctype}</p>
                        <p> <strong>Upload Date:</strong> {sourceData.upload_date}</p>
                    <div>
                    </div>
                </div>
                </div>
                
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                
                // add padding to the text
                padding: '20px',
                
            }}>
                {sourceData.text.split('\n').map((item, key) => {
                    return <span key={key}>{item}<br/></span>
                })
                }
            </div>
        </div>
    );

}

// Path: pages\notes\[note_id].js

// use getStaticPaths to generate all possible paths
export async function getStaticPaths() {
    // fetch list of notes
    const notes = await getAllNotes();

    const paths = notes.hits.hits.map((note) => ({
        params: { note_id: note._id },
    }));
    
    return { paths, fallback: false };
}

// use getStaticProps to fetch necessary data for the note
export async function getStaticProps({ params }) {
    // fetch necessary data for the note using params.note_id
    const note = await getElasticNoteById(params.note_id);
    
    // return the note as a prop
    return {
        props: {
            note,
        },
    };
}
