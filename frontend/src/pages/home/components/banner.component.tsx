import { Row, Button } from "react-bootstrap";

export const BannerSection = ({ banner, loginWithRedirect }: { banner: string; loginWithRedirect: any }) => (
  <Row>
    <img src={banner} alt="" style={{ height: "35rem", padding: "0px" }} />
    <div className="shadow home-blurb">
      <div className="m-2">
        <h5>Sidekick</h5>
        <p>Elevate your legal workflow</p>
        <p>Seamlessly integrate automation with your legal processes with your document extraction ally</p>
        <div className="text-center">
          <Button className="sidekick-primary-btn" onClick={() => loginWithRedirect()}>
            Get started
          </Button>
        </div>
      </div>
    </div>
  </Row>
);
