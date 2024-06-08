import { Container } from "react-bootstrap";
import { faGaugeHigh, faMicrochip, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";

import { BannerSection } from "./components/banner.component";
import { CallToAction } from "./components/callToAction.component";
import { FeatureSection } from "./components/feature.component";
import { TestimonialSection } from "./components/testimonial.component";

import banner from "../../img/pexels-pixabay-48148.jpg";
import testimonialImg1 from "../../img/testimonial-img-1.png";
import testimonialImg2 from "../../img/testimonial-img-2.png";
import testimonialImg3 from "../../img/testimonial-img-3.png";
import { FeatureProps } from "./interfaces/featureProps.interface";
import { TestimonialProps } from "./interfaces/testimonialProps.interface";

const Home = () => {
  const { user, loginWithRedirect } = useAuth0();
  if (user) console.log(user!["authGroups"]);

  const features: FeatureProps[] = [
    {
      icon: faGaugeHigh,
      title: "Speedy document processing",
      text: "The automated extraction of content from legal documents removes the need to manually search through documents to find information",
    },
    {
      icon: faMicrochip,
      title: "Intelligent extractions",
      text: "Using state of the art artificial intelligence and managed services, information can be easily extracted",
    },
    {
      icon: faBoxOpen,
      title: "Reliable storage",
      text: "Every document uploaded is stored reliably on the cloud, it is also secured to a high standard following the latest security guidelines",
    },
  ];

  const testimonials: TestimonialProps[] = [
    {
      img: testimonialImg1,
      title: "John (Solicitor, 32)",
      text: "Switching to using Sidekick has improved case processing times by 50% at JS and Associates, we havent looked back since switching to Sidekick!",
    },
    {
      img: testimonialImg2,
      title: "Jane (Secretary, 30)",
      text: "Sidekick has made my job so much easier. Gone are the days of needing to trawl through long documents to find information. I can now focus on more important activities!",
    },
    {
      img: testimonialImg3,
      title: "Sarah (Solicitor, 50)",
      text: "Sidekick has opened up so many possibilities for my law firm! Since switching to using it, we have received very positive feedback from clients about how much better our process is",
    },
  ];

  return (
    <Container>
      <BannerSection banner={banner} loginWithRedirect={loginWithRedirect} />
      <FeatureSection features={features} />
      <TestimonialSection testimonials={testimonials} />
      <CallToAction loginWithRedirect={loginWithRedirect} />
    </Container>
  );
};

export default Home;
