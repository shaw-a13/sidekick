import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user);

  if (isAuthenticated) {
    return (
      <Container style={{ paddingTop: "8rem" }}>
        <Row className="justify-content-md-center text-center">
          <Col xs lg="6">
            <Card>
              <Card.Body>
                <Card.Title>Profile Information </Card.Title>
                <hr />
                <Card.Subtitle className="mb-4">
                  <img src={user?.picture} alt="" />
                </Card.Subtitle>

                <div>
                  <Card.Subtitle className="mb-2">
                    Name: {user?.name}
                  </Card.Subtitle>
                  <hr />
                  <Card.Subtitle className="mb-2">
                    User ID: {user?.sub}
                  </Card.Subtitle>
                  <hr />
                  <Card.Subtitle className="mb-2">
                    Nickname: {user?.nickname}
                  </Card.Subtitle>
                  <hr />
                  <Card.Subtitle className="mb-2">
                    Updated: {user?.updated_at}
                  </Card.Subtitle>
                  <hr />
                  <Card.Subtitle className="mb-2">
                    User Groups: {user!["authGroups"].toString()}
                  </Card.Subtitle>
                  <Button
                    className="sidekick-primary-btn"
                    onClick={() => window.open("https://manage.auth0.com")}
                  >
                    Edit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  } else {
    return <h1>Not Authenticated</h1>;
  }
};

export default Profile;
