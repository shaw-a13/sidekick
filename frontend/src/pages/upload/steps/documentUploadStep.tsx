import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

import {
  Button,
  Card,
  Container,
  Form,
} from "react-bootstrap";


const uploadDocument = async (document: any, token: string) => {
    
    // GET request: presigned URL
    const response = await axios({
      method: "GET",
      url: "https://oo4zjrnf7c.execute-api.eu-west-1.amazonaws.com/prod/upload",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const presignedUrl = response.data.presignedUrl;
    console.log(presignedUrl);
  
    // Upload file to pre-signed URL
    const uploadResponse = await axios.put(presignedUrl, document, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
    console.log(uploadResponse);
  };

const DocumentUploadStep = (props: {
  uploadFile: any;
  uploadFileSetter: React.Dispatch<React.SetStateAction<any>>,
  token: string
}) => {
  return (
    <Container>
      <Card.Title>Document Upload</Card.Title>
      <Card.Text>
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Please upload the file you wish to analyse</Form.Label>
          <Form.Control
            type="file"
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              props.uploadFileSetter((target.files as FileList)[0]);
            }}
          />
        </Form.Group>
        <Button
          className="m-2"
          onClick={() => {
            uploadDocument(props.uploadFile, props.token);
          }}
        >
          Upload
        </Button>
      </Card.Text>
    </Container>
  );
};

export default DocumentUploadStep