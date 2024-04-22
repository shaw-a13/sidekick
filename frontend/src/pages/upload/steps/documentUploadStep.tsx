import axios from "axios";

import {
  Button,
  Card,
  Container,
  Form,
} from "react-bootstrap";

const uploadDocument = async (document: any) => {
    // GET request: presigned URL
    const response = await axios({
      method: "GET",
      url: "https://0lsi10z5ki.execute-api.eu-west-1.amazonaws.com/prod/upload",
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkdqQ3pUVFVrQVNESlMxWkhiR3BESCJ9.eyJpc3MiOiJodHRwczovL2Rldi1sb292eHg0Znd1em9oaThrLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJDYkhGYlVvNzJ0SGR0cmVzSWdvWkpGMlE2WkVXdjQ5U0BjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9zaWRla2ljay1hcGkuY29tIiwiaWF0IjoxNzEyNzY2MTY0LCJleHAiOjE3MTI4NTI1NjQsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IkNiSEZiVW83MnRIZHRyZXNJZ29aSkYyUTZaRVd2NDlTIn0.eu_eTp0zBSaxYoWOWOLELawt9DI5A9tUmckJtbXsIIy75xJr4IVGxBqUhtwA94uRFrFRxjw4zezsXNBEm2gDsAI-ZQH7JQpdK0OLwIzdsgs_4XAmHUG5X5_hGnFOGas5eNvvJbNV9aoZwEgumsbrVErT0mMnU8jgcmaYI5i-JWhYS6DWYW3OHkM3aKRXc7KifG9BY3SZNkY15DLD_bX_NEk3ZZIC3poPXNbQYFO6IYNtVQO6oLurEv28weFZUWUDYQcLZp2w6rQBMIIhXQEDgw0siqHqgkGdzZMWsofjIn8G_sz4SMCicDo4jvXgaezwOPSULuSdtYd6hh33GvV4GA`,
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
  uploadFileSetter: React.Dispatch<React.SetStateAction<any>>;
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
            uploadDocument(props.uploadFile);
          }}
        >
          Upload
        </Button>
      </Card.Text>
    </Container>
  );
};

export default DocumentUploadStep