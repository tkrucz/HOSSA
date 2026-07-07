import { useEffect, useState } from "react";


function App() {

  const [documents,setDocuments] = useState([]);


  useEffect(()=>{

    fetch(
      "http://127.0.0.1:8000/documents"
    )
    .then(res=>res.json())
    .then(data=>setDocuments(data));

  },[]);



  return (

    <div>

      <h1>
        Dokumentacja projektu
      </h1>


      <table>

        <thead>

          <tr>
            <th>Nazwa</th>
            <th>Status</th>
          </tr>

        </thead>


        <tbody>

        {
          documents.map(doc=>(

            <tr key={doc.document_id}>

              <td>
                {doc.doc_name}
              </td>


              <td>

                <span
                style={{
                  backgroundColor:"#"+doc.color,
                  padding:"5px 10px",
                  borderRadius:"8px"
                }}
                >

                {doc.status}

                </span>

              </td>

            </tr>

          ))
        }

        </tbody>

      </table>


    </div>

  )
}


export default App