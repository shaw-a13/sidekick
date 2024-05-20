import { useParams } from "react-router-dom";
import { CaseService } from "../services/case.service";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { CaseDynamo } from "../interfaces/case/caseDynamo.interface";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
  Table,
  Form,
} from "react-bootstrap";
import { DocumentService } from "../services/document.service";
import axios from "axios";
import { DocumentResultResponse } from "../interfaces/document/documentResultResponse.interface";
import { CaseEditProps } from "../interfaces/case/caseEditProps.interface";
interface ExtractionResult {
  key: string;
  locations: {
    fileName: string;
    key: {};
    pageNumber: number;
    value: {};
  };
  score: number;
  source: string;
  value: string;
}

const Case = () => {
  const mockRes: CaseDynamo[] = [
    {
      clientName: {
        S: "Aaron Shaw",
      },
      nature: {
        S: "Property",
      },
      date: {
        S: "2024-05-07",
      },
      status: {
        S: "OPEN",
      },
      assignee: {
        S: "",
      },
      SK: {
        S: "e4c94afb-da5d-4d21-a64a-ccd0f694c7a5",
      },
      description: {
        S: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
      },
      clientId: {
        S: "d5de31e6-0044-481e-bb6c-d1b3d8c8b386",
      },
    },
  ];

  const [caseEditInfo, setCaseEditInfo] = useState({
    clientId: mockRes[0].clientId.S.toString(),
    clientName: mockRes[0].clientName.S.toString(),
    status: mockRes[0].status.S.toString(),
    description: mockRes[0].description.S.toString(),
    nature: mockRes[0].nature.S.toString(),
    date: mockRes[0].date.S.toString(),
    assignee: mockRes[0].assignee.S.toString(),
  });

  const handleCaseEditChange = (event: any) => {
    console.log(event.target);
    const { name, value } = event.target;

    setCaseEditInfo({ ...caseEditInfo, [name]: value });
  };

  const mockDocs = {
    urls: [
      {
        id: "14414744-a8b7-4fa1-977c-19c4247126e3",
        original:
          "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/14414744-a8b7-4fa1-977c-19c4247126e3/original/14414744-a8b7-4fa1-977c-19c4247126e3.pdf?AWSAccessKeyId=ASIAU6GDW6WBNQ47SMV5&Signature=ZQDdOGkNK3KcnYXsTypN3fABSCI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIDGyCL70dfbv76Fj8L06vtnIgtg0TFUMgOMghDSeIIcbAiEAtXkAo8d2UkKcUumgnza1X4Ee9sZtKKfJaqsi21tnSPYqtwMILxAAGgwzMzk3MTI4NjU2NjYiDIDMOWem2DOu8vYxSyqUAzYj7V9D1eeIocFS3sMeNmXBaCYjkEJf5FeQaD%2FIRYWUvc7V0TIrqWwndfPDznSLnz7zhkI1JYO4jLv1JgPPbnzg%2FbpZ7Py3tsmuKYCmVRH10IkWe0F%2FY7Jpdq7vXk5wZBped5T6cJC1YfzsZvbqb4eEH47NOdddCGRB49G6sTOj1BxD6VIgtZcrpUhbS%2B%2B0aUxhLf9gOwgMv41PLb93WHP3LYgjf65U5S%2FYuycU%2Bsf9ARFzSBrYhx2V5cZ7nnBJF6aDypTKREF1FVEFCkB7c%2Fx9HrizGOtsJ6K7XhQTtKw8kBbUPBO%2BiZ5u%2FcsWI0woffQCWmQrw8q680OSlFKek3vKz2QFjHEyvImMGYwOqvtULojQTcd8gQw1GCZualPOH2q9vSEXDx6J6dgXPjUqEuyaqMWe1%2FQI7%2F8CUZDNpLRF3UeIzgHK8JfIrMY52Ye3I3CLUXbYuVgKAQdH0OFSlnhy0C%2BoG%2F48%2FiN89kszsCbZxVnrYWQEGgutMO8GjmL%2Fu32kG9mM3A7KH2DOsr8J%2B%2Fvt9ru1MPuzrbIGOp4Bws3da6PAHguT1Y5CnzwTS6Q5RvKibCUmUaAqJ9hSmLPssV4BemosR4%2Bb9W2quQQbnTa3GgkHfJLqrrOWhwOsCvztMh2wPlp6Wt%2BwXO20qbri3V3aQ%2FTnPHYZL7gSVesuJ2gpeRQmxWDf1PZcfXt7vSotljUmZb%2F35SJkPK83IB95o4KROJpqoamdRu7NaraLVQG1f96tKsjiLIB4MFs%3D&Expires=1716217868",
        processed:
          "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/14414744-a8b7-4fa1-977c-19c4247126e3/processedResults/processedResults.json?AWSAccessKeyId=ASIAU6GDW6WBNQ47SMV5&Signature=2UTTTujpObGttNEWZhcWwiPGHD4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIDGyCL70dfbv76Fj8L06vtnIgtg0TFUMgOMghDSeIIcbAiEAtXkAo8d2UkKcUumgnza1X4Ee9sZtKKfJaqsi21tnSPYqtwMILxAAGgwzMzk3MTI4NjU2NjYiDIDMOWem2DOu8vYxSyqUAzYj7V9D1eeIocFS3sMeNmXBaCYjkEJf5FeQaD%2FIRYWUvc7V0TIrqWwndfPDznSLnz7zhkI1JYO4jLv1JgPPbnzg%2FbpZ7Py3tsmuKYCmVRH10IkWe0F%2FY7Jpdq7vXk5wZBped5T6cJC1YfzsZvbqb4eEH47NOdddCGRB49G6sTOj1BxD6VIgtZcrpUhbS%2B%2B0aUxhLf9gOwgMv41PLb93WHP3LYgjf65U5S%2FYuycU%2Bsf9ARFzSBrYhx2V5cZ7nnBJF6aDypTKREF1FVEFCkB7c%2Fx9HrizGOtsJ6K7XhQTtKw8kBbUPBO%2BiZ5u%2FcsWI0woffQCWmQrw8q680OSlFKek3vKz2QFjHEyvImMGYwOqvtULojQTcd8gQw1GCZualPOH2q9vSEXDx6J6dgXPjUqEuyaqMWe1%2FQI7%2F8CUZDNpLRF3UeIzgHK8JfIrMY52Ye3I3CLUXbYuVgKAQdH0OFSlnhy0C%2BoG%2F48%2FiN89kszsCbZxVnrYWQEGgutMO8GjmL%2Fu32kG9mM3A7KH2DOsr8J%2B%2Fvt9ru1MPuzrbIGOp4Bws3da6PAHguT1Y5CnzwTS6Q5RvKibCUmUaAqJ9hSmLPssV4BemosR4%2Bb9W2quQQbnTa3GgkHfJLqrrOWhwOsCvztMh2wPlp6Wt%2BwXO20qbri3V3aQ%2FTnPHYZL7gSVesuJ2gpeRQmxWDf1PZcfXt7vSotljUmZb%2F35SJkPK83IB95o4KROJpqoamdRu7NaraLVQG1f96tKsjiLIB4MFs%3D&Expires=1716217868",
      },
      {
        id: "2cfe7f88-da2b-411c-be0f-4e736e6703db",
        original:
          "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/2cfe7f88-da2b-411c-be0f-4e736e6703db/original/2cfe7f88-da2b-411c-be0f-4e736e6703db.pdf?AWSAccessKeyId=ASIAU6GDW6WBNQ47SMV5&Signature=OMlvcdEB0Ailg%2F%2BuPA60zFycQHQ%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIDGyCL70dfbv76Fj8L06vtnIgtg0TFUMgOMghDSeIIcbAiEAtXkAo8d2UkKcUumgnza1X4Ee9sZtKKfJaqsi21tnSPYqtwMILxAAGgwzMzk3MTI4NjU2NjYiDIDMOWem2DOu8vYxSyqUAzYj7V9D1eeIocFS3sMeNmXBaCYjkEJf5FeQaD%2FIRYWUvc7V0TIrqWwndfPDznSLnz7zhkI1JYO4jLv1JgPPbnzg%2FbpZ7Py3tsmuKYCmVRH10IkWe0F%2FY7Jpdq7vXk5wZBped5T6cJC1YfzsZvbqb4eEH47NOdddCGRB49G6sTOj1BxD6VIgtZcrpUhbS%2B%2B0aUxhLf9gOwgMv41PLb93WHP3LYgjf65U5S%2FYuycU%2Bsf9ARFzSBrYhx2V5cZ7nnBJF6aDypTKREF1FVEFCkB7c%2Fx9HrizGOtsJ6K7XhQTtKw8kBbUPBO%2BiZ5u%2FcsWI0woffQCWmQrw8q680OSlFKek3vKz2QFjHEyvImMGYwOqvtULojQTcd8gQw1GCZualPOH2q9vSEXDx6J6dgXPjUqEuyaqMWe1%2FQI7%2F8CUZDNpLRF3UeIzgHK8JfIrMY52Ye3I3CLUXbYuVgKAQdH0OFSlnhy0C%2BoG%2F48%2FiN89kszsCbZxVnrYWQEGgutMO8GjmL%2Fu32kG9mM3A7KH2DOsr8J%2B%2Fvt9ru1MPuzrbIGOp4Bws3da6PAHguT1Y5CnzwTS6Q5RvKibCUmUaAqJ9hSmLPssV4BemosR4%2Bb9W2quQQbnTa3GgkHfJLqrrOWhwOsCvztMh2wPlp6Wt%2BwXO20qbri3V3aQ%2FTnPHYZL7gSVesuJ2gpeRQmxWDf1PZcfXt7vSotljUmZb%2F35SJkPK83IB95o4KROJpqoamdRu7NaraLVQG1f96tKsjiLIB4MFs%3D&Expires=1716217868",
        processed:
          "https://sidekick-cases.s3.amazonaws.com/b9a8a137-5802-43b3-ae8a-653869f761c1/2cfe7f88-da2b-411c-be0f-4e736e6703db/processedResults/processedResults.json?AWSAccessKeyId=ASIAU6GDW6WBNQ47SMV5&Signature=cRTaVdMz%2F87k%2FhqHhqktgoaqJIM%3D&x-amz-security-token=IQoJb3JpZ2luX2VjELb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIDGyCL70dfbv76Fj8L06vtnIgtg0TFUMgOMghDSeIIcbAiEAtXkAo8d2UkKcUumgnza1X4Ee9sZtKKfJaqsi21tnSPYqtwMILxAAGgwzMzk3MTI4NjU2NjYiDIDMOWem2DOu8vYxSyqUAzYj7V9D1eeIocFS3sMeNmXBaCYjkEJf5FeQaD%2FIRYWUvc7V0TIrqWwndfPDznSLnz7zhkI1JYO4jLv1JgPPbnzg%2FbpZ7Py3tsmuKYCmVRH10IkWe0F%2FY7Jpdq7vXk5wZBped5T6cJC1YfzsZvbqb4eEH47NOdddCGRB49G6sTOj1BxD6VIgtZcrpUhbS%2B%2B0aUxhLf9gOwgMv41PLb93WHP3LYgjf65U5S%2FYuycU%2Bsf9ARFzSBrYhx2V5cZ7nnBJF6aDypTKREF1FVEFCkB7c%2Fx9HrizGOtsJ6K7XhQTtKw8kBbUPBO%2BiZ5u%2FcsWI0woffQCWmQrw8q680OSlFKek3vKz2QFjHEyvImMGYwOqvtULojQTcd8gQw1GCZualPOH2q9vSEXDx6J6dgXPjUqEuyaqMWe1%2FQI7%2F8CUZDNpLRF3UeIzgHK8JfIrMY52Ye3I3CLUXbYuVgKAQdH0OFSlnhy0C%2BoG%2F48%2FiN89kszsCbZxVnrYWQEGgutMO8GjmL%2Fu32kG9mM3A7KH2DOsr8J%2B%2Fvt9ru1MPuzrbIGOp4Bws3da6PAHguT1Y5CnzwTS6Q5RvKibCUmUaAqJ9hSmLPssV4BemosR4%2Bb9W2quQQbnTa3GgkHfJLqrrOWhwOsCvztMh2wPlp6Wt%2BwXO20qbri3V3aQ%2FTnPHYZL7gSVesuJ2gpeRQmxWDf1PZcfXt7vSotljUmZb%2F35SJkPK83IB95o4KROJpqoamdRu7NaraLVQG1f96tKsjiLIB4MFs%3D&Expires=1716217868",
      },
    ],
  };

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [caseInfo, setCaseInfo] = useState<CaseDynamo>();
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [docNo, setDocNo] = useState(0);
  const [docApiData, setDocApiData] = useState<DocumentResultResponse>();
  const [extractionData, setExtractionData] = useState<ExtractionResult[]>();
  const [documentData, setDocumentData] = useState("");

  const documentService = new DocumentService();
  const { id } = useParams();
  const [editCaseDetails, setEditCaseDetails] = useState(false);

  const getAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `https://sidekick-api.com`,
          scope: "read:current_user",
        },
      });
      return accessToken;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const caseService = new CaseService();

  const submitCaseEdit = (edit_obj: CaseEditProps) => {
    console.log(edit_obj);
    getAccessToken().then((token) => {
      caseService.editCase(token!, edit_obj, id!);
    });
  };

  const getCase = async (token: string) => {
    return await caseService.getSingleCase(token, id!);
  };

  let results: ExtractionResult;

  const updateExtractionData = async (docNo: number) => {
    await axios
      .get<ExtractionResult[]>(docApiData!.urls[docNo].processed)
      .then((res) => {
        setExtractionData(res.data);
        console.log(extractionData);
      });
  };

  useEffect(() => {
    // getAccessToken().then(token => {getCase(token!).then(res => {setLoading(true); setCaseInfo(res?.data[0]); setLoading(false)});})
    getAccessToken().then(async (token) => {
      setLoading(true);
      setCaseInfo(mockRes[0]);
      setDocumentData(mockDocs.urls[docNo].original);
      // await documentService.getDocuments(token!, id!).then(async (res) => {
      //   console.log(res);
      //   setDocApiData(res?.data);
      //   setDocumentData(res?.data.urls[docNo].original!);
      //   await axios
      //   .get<ExtractionResult[]>(res?.data.urls[docNo].processed!)
      //   .then((res) => {
      //     setExtractionData(res.data);
      //     console.log(res.data);
      //   });
      // });

      // await axios.get<ExtractionResult[]>(mockDocs.urls[docNo].processed).then((res) => {
      //   setExtractionData(res.data)
      //   console.log(res.data)
      // })
      setExtractionData([
        {
          key: "3. Price",
          value: "£250,000",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.10458724945783615,
                Height: 0.010781127959489822,
                Left: 0.15029382705688477,
                Top: 0.2854066491127014,
              },
              polygon: [
                {
                  X: 0.15029382705688477,
                  Y: 0.28542202711105347,
                },
                {
                  X: 0.254876971244812,
                  Y: 0.2854066491127014,
                },
                {
                  X: 0.2548810839653015,
                  Y: 0.29617246985435486,
                },
                {
                  X: 0.15029747784137726,
                  Y: 0.29618775844573975,
                },
              ],
              score: 94.95732116699219,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.07666965574026108,
                Height: 0.011871536262333393,
                Left: 0.38916680216789246,
                Top: 0.284440279006958,
              },
              polygon: [
                {
                  X: 0.38916680216789246,
                  Y: 0.28445157408714294,
                },
                {
                  X: 0.46583089232444763,
                  Y: 0.284440279006958,
                },
                {
                  X: 0.46583646535873413,
                  Y: 0.29630061984062195,
                },
                {
                  X: 0.3891719579696655,
                  Y: 0.2963118255138397,
                },
              ],
              score: 94.95732116699219,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 94.95732116699219,
        },
        {
          key: "2. Purchaser",
          value: "Mr Donald Smith",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.14721524715423584,
                Height: 0.010459384880959988,
                Left: 0.15035566687583923,
                Top: 0.25410738587379456,
              },
              polygon: [
                {
                  X: 0.15035566687583923,
                  Y: 0.25412943959236145,
                },
                {
                  X: 0.2975667417049408,
                  Y: 0.25410738587379456,
                },
                {
                  X: 0.2975709140300751,
                  Y: 0.26454484462738037,
                },
                {
                  X: 0.15035919845104218,
                  Y: 0.2645667791366577,
                },
              ],
              score: 94.02574920654297,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.13728126883506775,
                Height: 0.010815897025167942,
                Left: 0.38882115483283997,
                Top: 0.2526930272579193,
              },
              polygon: [
                {
                  X: 0.38882115483283997,
                  Y: 0.2527136206626892,
                },
                {
                  X: 0.5260971188545227,
                  Y: 0.2526930272579193,
                },
                {
                  X: 0.5261024236679077,
                  Y: 0.2634884715080261,
                },
                {
                  X: 0.3888258635997772,
                  Y: 0.26350894570350647,
                },
              ],
              score: 94.02574920654297,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 94.02574920654297,
        },
        {
          key: "4. Description of Property and interest sold",
          value:
            "The freehold title of the property known as 1-12 Archway Heights 16-20 Archway Road London N19 and for the purposes of identification only shown edged red on the plan attached to this Agreement",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.17662078142166138,
                Height: 0.04062100499868393,
                Left: 0.15005545318126678,
                Top: 0.3155803084373474,
              },
              polygon: [
                {
                  X: 0.15005545318126678,
                  Y: 0.3156058192253113,
                },
                {
                  X: 0.32665956020355225,
                  Y: 0.3155803084373474,
                },
                {
                  X: 0.32667624950408936,
                  Y: 0.3561764061450958,
                },
                {
                  X: 0.1500692069530487,
                  Y: 0.35620132088661194,
                },
              ],
              score: 85.27501678466797,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.45724642276763916,
                Height: 0.06027213856577873,
                Left: 0.3880181610584259,
                Top: 0.3153258264064789,
              },
              polygon: [
                {
                  X: 0.3880181610584259,
                  Y: 0.3153919279575348,
                },
                {
                  X: 0.845227062702179,
                  Y: 0.3153258264064789,
                },
                {
                  X: 0.8452646136283875,
                  Y: 0.3755342662334442,
                },
                {
                  X: 0.38804441690444946,
                  Y: 0.3755979835987091,
                },
              ],
              score: 85.27501678466797,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 85.27501678466797,
        },
        {
          key: "6. Completion Date",
          value:
            "On the day of 200 at the office of the Vendor's Principal Lawyer, Alexandra House, 10 Station Road, Wood Green N22 7TR",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.20003730058670044,
                Height: 0.013303621672093868,
                Left: 0.15022853016853333,
                Top: 0.43546128273010254,
              },
              polygon: [
                {
                  X: 0.15022853016853333,
                  Y: 0.43548813462257385,
                },
                {
                  X: 0.35026025772094727,
                  Y: 0.43546128273010254,
                },
                {
                  X: 0.35026583075523376,
                  Y: 0.44873830676078796,
                },
                {
                  X: 0.15023303031921387,
                  Y: 0.4487649202346802,
                },
              ],
              score: 80,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.45629432797431946,
                Height: 0.04378143697977066,
                Left: 0.3886575996875763,
                Top: 0.42486000061035156,
              },
              polygon: [
                {
                  X: 0.3886575996875763,
                  Y: 0.4249216318130493,
                },
                {
                  X: 0.8449246883392334,
                  Y: 0.42486000061035156,
                },
                {
                  X: 0.8449519276618958,
                  Y: 0.46858155727386475,
                },
                {
                  X: 0.3886766731739044,
                  Y: 0.4686414301395416,
                },
              ],
              score: 80,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 80,
        },
        {
          key: "A.",
          value:
            'Title is deduced and consists of as shown in Part I of the Schedule to this Agreement ("the Schedule").',
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.017467444762587547,
                Height: 0.010358050465583801,
                Left: 0.14979451894760132,
                Top: 0.7909784317016602,
              },
              polygon: [
                {
                  X: 0.14979451894760132,
                  Y: 0.7909802198410034,
                },
                {
                  X: 0.1672583818435669,
                  Y: 0.7909784317016602,
                },
                {
                  X: 0.16726195812225342,
                  Y: 0.8013347387313843,
                },
                {
                  X: 0.14979802072048187,
                  Y: 0.8013364672660828,
                },
              ],
              score: 45.312686920166016,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.6376281976699829,
                Height: 0.04326647147536278,
                Left: 0.21090486645698547,
                Top: 0.7906216979026794,
              },
              polygon: [
                {
                  X: 0.21090486645698547,
                  Y: 0.7906875014305115,
                },
                {
                  X: 0.8485060930252075,
                  Y: 0.7906216979026794,
                },
                {
                  X: 0.848533034324646,
                  Y: 0.8338247537612915,
                },
                {
                  X: 0.2109205722808838,
                  Y: 0.8338881731033325,
                },
              ],
              score: 45.312686920166016,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 45.312686920166016,
        },
        {
          key: "(i) Vendor",
          value:
            "THE MAYOR AND BURGESSES OF THE LONDON BOROUGH OF HARINGEY of the Civic Centre, Wood Green, N22 8LE acting by its Principal Lawyer",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.12010519206523895,
                Height: 0.013621160760521889,
                Left: 0.2131970375776291,
                Top: 0.1634698361158371,
              },
              polygon: [
                {
                  X: 0.2131970375776291,
                  Y: 0.16348879039287567,
                },
                {
                  X: 0.33329659700393677,
                  Y: 0.1634698361158371,
                },
                {
                  X: 0.33330222964286804,
                  Y: 0.1770721971988678,
                },
                {
                  X: 0.21320198476314545,
                  Y: 0.17709100246429443,
                },
              ],
              score: 68.6856918334961,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.45726487040519714,
                Height: 0.043203771114349365,
                Left: 0.3883327841758728,
                Top: 0.1616249978542328,
              },
              polygon: [
                {
                  X: 0.3883327841758728,
                  Y: 0.16169722378253937,
                },
                {
                  X: 0.8455708026885986,
                  Y: 0.1616249978542328,
                },
                {
                  X: 0.8455976843833923,
                  Y: 0.20475827157497406,
                },
                {
                  X: 0.38835158944129944,
                  Y: 0.20482876896858215,
                },
              ],
              score: 68.6856918334961,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 68.6856918334961,
        },
        {
          key: "(ii) Selling",
          value: "Full Title Guarantee",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 1,
            key: {
              boundingBox: {
                Width: 0.1154622882604599,
                Height: 0.013519397005438805,
                Left: 0.21344424784183502,
                Top: 0.22383147478103638,
              },
              polygon: [
                {
                  X: 0.21344424784183502,
                  Y: 0.2238490879535675,
                },
                {
                  X: 0.3289009928703308,
                  Y: 0.22383147478103638,
                },
                {
                  X: 0.3289065361022949,
                  Y: 0.23733338713645935,
                },
                {
                  X: 0.21344918012619019,
                  Y: 0.23735086619853973,
                },
              ],
              score: 94.68177795410156,
              pageNumber: 1,
            },
            value: {
              boundingBox: {
                Width: 0.16187100112438202,
                Height: 0.010975221171975136,
                Left: 0.3895174264907837,
                Top: 0.22130028903484344,
              },
              polygon: [
                {
                  X: 0.3895174264907837,
                  Y: 0.22132501006126404,
                },
                {
                  X: 0.5513828992843628,
                  Y: 0.22130028903484344,
                },
                {
                  X: 0.5513884425163269,
                  Y: 0.23225094377994537,
                },
                {
                  X: 0.3895221948623657,
                  Y: 0.23227551579475403,
                },
              ],
              score: 94.68177795410156,
              pageNumber: 1,
            },
          },
          source: "processedResults.json",
          score: 94.68177795410156,
        },
        {
          key: "H.",
          value: "The Buyer shall accept notwithstanding that",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 2,
            key: {
              boundingBox: {
                Width: 0.018013641238212585,
                Height: 0.010024148970842361,
                Left: 0.14994828402996063,
                Top: 0.507827877998352,
              },
              polygon: [
                {
                  X: 0.14995048940181732,
                  Y: 0.507827877998352,
                },
                {
                  X: 0.16796192526817322,
                  Y: 0.5078413486480713,
                },
                {
                  X: 0.1679597944021225,
                  Y: 0.5178520679473877,
                },
                {
                  X: 0.14994828402996063,
                  Y: 0.5178385376930237,
                },
              ],
              score: 35.160125732421875,
              pageNumber: 2,
            },
            value: {
              boundingBox: {
                Width: 0.19613665342330933,
                Height: 0.04219277948141098,
                Left: 0.2099805474281311,
                Top: 0.5078728199005127,
              },
              polygon: [
                {
                  X: 0.2099887728691101,
                  Y: 0.5078728199005127,
                },
                {
                  X: 0.40611720085144043,
                  Y: 0.5080194473266602,
                },
                {
                  X: 0.4061123728752136,
                  Y: 0.5500655770301819,
                },
                {
                  X: 0.2099805474281311,
                  Y: 0.5499183535575867,
                },
              ],
              score: 35.160125732421875,
              pageNumber: 2,
            },
          },
          source: "processedResults.json",
          score: 35.160125732421875,
        },
        {
          key: "K.",
          value:
            "The parties will complete a Transfer substantially in the form of the draft",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 2,
            key: {
              boundingBox: {
                Width: 0.01701594516634941,
                Height: 0.011028491891920567,
                Left: 0.14986231923103333,
                Top: 0.8973039388656616,
              },
              polygon: [
                {
                  X: 0.14986474812030792,
                  Y: 0.8973039388656616,
                },
                {
                  X: 0.16687826812267303,
                  Y: 0.897317111492157,
                },
                {
                  X: 0.1668759137392044,
                  Y: 0.9083324670791626,
                },
                {
                  X: 0.14986231923103333,
                  Y: 0.9083192944526672,
                },
              ],
              score: 52.940528869628906,
              pageNumber: 2,
            },
            value: {
              boundingBox: {
                Width: 0.6385429501533508,
                Height: 0.014514421112835407,
                Left: 0.20990988612174988,
                Top: 0.8973504304885864,
              },
              polygon: [
                {
                  X: 0.20991262793540955,
                  Y: 0.8973504304885864,
                },
                {
                  X: 0.8484518527984619,
                  Y: 0.897844672203064,
                },
                {
                  X: 0.8484528064727783,
                  Y: 0.9118648767471313,
                },
                {
                  X: 0.20990988612174988,
                  Y: 0.911370038986206,
                },
              ],
              score: 52.940528869628906,
              pageNumber: 2,
            },
          },
          source: "processedResults.json",
          score: 52.940528869628906,
        },
        {
          key: "DATED",
          value: "09/05/2024",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 3,
            key: {
              boundingBox: {
                Width: 0.06376206129789352,
                Height: 0.010923477821052074,
                Left: 0.15044668316841125,
                Top: 0.7183482646942139,
              },
              polygon: [
                {
                  X: 0.15044668316841125,
                  Y: 0.7183555364608765,
                },
                {
                  X: 0.2142002284526825,
                  Y: 0.7183482646942139,
                },
                {
                  X: 0.21420875191688538,
                  Y: 0.7292644381523132,
                },
                {
                  X: 0.15045486390590668,
                  Y: 0.7292717695236206,
                },
              ],
              score: 94.8521728515625,
              pageNumber: 3,
            },
            value: {
              boundingBox: {
                Width: 0.0930001363158226,
                Height: 0.01093388069421053,
                Left: 0.21901248395442963,
                Top: 0.7183529734611511,
              },
              polygon: [
                {
                  X: 0.21901248395442963,
                  Y: 0.7183636426925659,
                },
                {
                  X: 0.31200355291366577,
                  Y: 0.7183529734611511,
                },
                {
                  X: 0.31201261281967163,
                  Y: 0.7292762994766235,
                },
                {
                  X: 0.2190210372209549,
                  Y: 0.7292869091033936,
                },
              ],
              score: 94.8521728515625,
              pageNumber: 3,
            },
          },
          source: "processedResults.json",
          score: 94.8521728515625,
        },
        {
          key: "AS WITNESS the parties",
          value: "John Witnesser",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 3,
            key: {
              boundingBox: {
                Width: 0.2069980651140213,
                Height: 0.013290392234921455,
                Left: 0.1499527096748352,
                Top: 0.7634273171424866,
              },
              polygon: [
                {
                  X: 0.1499527096748352,
                  Y: 0.7634507417678833,
                },
                {
                  X: 0.3569394648075104,
                  Y: 0.7634273171424866,
                },
                {
                  X: 0.3569507896900177,
                  Y: 0.7766943573951721,
                },
                {
                  X: 0.1499626487493515,
                  Y: 0.7767177224159241,
                },
              ],
              score: 91.05550384521484,
              pageNumber: 3,
            },
            value: {
              boundingBox: {
                Width: 0.12862862646579742,
                Height: 0.010780234821140766,
                Left: 0.15010377764701843,
                Top: 0.8085081577301025,
              },
              polygon: [
                {
                  X: 0.15010377764701843,
                  Y: 0.8085225224494934,
                },
                {
                  X: 0.27872365713119507,
                  Y: 0.8085081577301025,
                },
                {
                  X: 0.27873238921165466,
                  Y: 0.8192740082740784,
                },
                {
                  X: 0.1501118391752243,
                  Y: 0.8192883729934692,
                },
              ],
              score: 91.05550384521484,
              pageNumber: 3,
            },
          },
          source: "processedResults.json",
          score: 91.05550384521484,
        },
        {
          key: "Purchaser's Solicitor",
          value: "Test Solicitor",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 3,
            key: {
              boundingBox: {
                Width: 0.16779619455337524,
                Height: 0.010877358727157116,
                Left: 0.514385461807251,
                Top: 0.8834136724472046,
              },
              polygon: [
                {
                  X: 0.514385461807251,
                  Y: 0.8834320902824402,
                },
                {
                  X: 0.6821706295013428,
                  Y: 0.8834136724472046,
                },
                {
                  X: 0.6821816563606262,
                  Y: 0.8942726254463196,
                },
                {
                  X: 0.5143955945968628,
                  Y: 0.8942910432815552,
                },
              ],
              score: 94.27701568603516,
              pageNumber: 3,
            },
            value: {
              boundingBox: {
                Width: 0.17030109465122223,
                Height: 0.016446297988295555,
                Left: 0.5493543148040771,
                Top: 0.8533424139022827,
              },
              polygon: [
                {
                  X: 0.5493543148040771,
                  Y: 0.8533612489700317,
                },
                {
                  X: 0.719638466835022,
                  Y: 0.8533424139022827,
                },
                {
                  X: 0.7196553945541382,
                  Y: 0.8697699308395386,
                },
                {
                  X: 0.5493698716163635,
                  Y: 0.8697887063026428,
                },
              ],
              score: 94.27701568603516,
              pageNumber: 3,
            },
          },
          source: "processedResults.json",
          score: 94.27701568603516,
        },
        {
          key: "SIGNED:",
          value: "J Witness",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 3,
            key: {
              boundingBox: {
                Width: 0.07609736919403076,
                Height: 0.010994207113981247,
                Left: 0.15616492927074432,
                Top: 0.8533431887626648,
              },
              polygon: [
                {
                  X: 0.15616492927074432,
                  Y: 0.8533515930175781,
                },
                {
                  X: 0.23225362598896027,
                  Y: 0.8533431887626648,
                },
                {
                  X: 0.23226229846477509,
                  Y: 0.8643289804458618,
                },
                {
                  X: 0.15617318451404572,
                  Y: 0.8643373847007751,
                },
              ],
              score: 66.90390014648438,
              pageNumber: 3,
            },
            value: {
              boundingBox: {
                Width: 0.1371499001979828,
                Height: 0.037654273211956024,
                Left: 0.24274365603923798,
                Top: 0.8495175242424011,
              },
              polygon: [
                {
                  X: 0.24274365603923798,
                  Y: 0.8495327234268188,
                },
                {
                  X: 0.379861056804657,
                  Y: 0.8495175242424011,
                },
                {
                  X: 0.37989357113838196,
                  Y: 0.8871567249298096,
                },
                {
                  X: 0.24277357757091522,
                  Y: 0.8871718049049377,
                },
              ],
              score: 66.90390014648438,
              pageNumber: 3,
            },
          },
          source: "processedResults.json",
          score: 66.90390014648438,
        },
        {
          key: "Part 3",
          value: "The sale is with vacant possession on completion.",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 3,
            key: {
              boundingBox: {
                Width: 0.05066303908824921,
                Height: 0.010787291452288628,
                Left: 0.5046945810317993,
                Top: 0.5983569622039795,
              },
              polygon: [
                {
                  X: 0.5046945810317993,
                  Y: 0.598362922668457,
                },
                {
                  X: 0.5553473830223083,
                  Y: 0.5983569622039795,
                },
                {
                  X: 0.5553576350212097,
                  Y: 0.6091383099555969,
                },
                {
                  X: 0.5047045946121216,
                  Y: 0.6091442108154297,
                },
              ],
              score: 48.73358917236328,
              pageNumber: 3,
            },
            value: {
              boundingBox: {
                Width: 0.4091343581676483,
                Height: 0.01391657069325447,
                Left: 0.28929245471954346,
                Top: 0.6277419924736023,
              },
              polygon: [
                {
                  X: 0.28929245471954346,
                  Y: 0.6277897953987122,
                },
                {
                  X: 0.6984126567840576,
                  Y: 0.6277419924736023,
                },
                {
                  X: 0.6984268426895142,
                  Y: 0.6416109204292297,
                },
                {
                  X: 0.28930380940437317,
                  Y: 0.64165860414505,
                },
              ],
              score: 48.73358917236328,
              pageNumber: 3,
            },
          },
          source: "processedResults.json",
          score: 48.73358917236328,
        },
        {
          key: "John Suddaby",
          value:
            "Head of Legal Services London Borough of Haringey Alexandra House 10 Station Road Wood Green London N22 7TR",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 4,
            key: {
              boundingBox: {
                Width: 0.11968459188938141,
                Height: 0.013780802488327026,
                Left: 0.14994211494922638,
                Top: 0.11710311472415924,
              },
              polygon: [
                {
                  X: 0.14994211494922638,
                  Y: 0.11711113154888153,
                },
                {
                  X: 0.26961278915405273,
                  Y: 0.11710311472415924,
                },
                {
                  X: 0.2696267068386078,
                  Y: 0.13087613880634308,
                },
                {
                  X: 0.1499554067850113,
                  Y: 0.13088391721248627,
                },
              ],
              score: 57.538597106933594,
              pageNumber: 4,
            },
            value: {
              boundingBox: {
                Width: 0.23752041161060333,
                Height: 0.0863083079457283,
                Left: 0.15003430843353271,
                Top: 0.13211281597614288,
              },
              polygon: [
                {
                  X: 0.15003430843353271,
                  Y: 0.13212820887565613,
                },
                {
                  X: 0.38746368885040283,
                  Y: 0.13211281597614288,
                },
                {
                  X: 0.38755473494529724,
                  Y: 0.21840867400169373,
                },
                {
                  X: 0.15011756122112274,
                  Y: 0.21842113137245178,
                },
              ],
              score: 57.538597106933594,
              pageNumber: 4,
            },
          },
          source: "processedResults.json",
          score: 57.538597106933594,
        },
        {
          key: "Dated",
          value: "09/05/2024",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 5,
            key: {
              boundingBox: {
                Width: 0.049111258238554,
                Height: 0.011207030154764652,
                Left: 0.269753098487854,
                Top: 0.13197268545627594,
              },
              polygon: [
                {
                  X: 0.269753098487854,
                  Y: 0.13201048970222473,
                },
                {
                  X: 0.31884944438934326,
                  Y: 0.13197268545627594,
                },
                {
                  X: 0.3188643455505371,
                  Y: 0.14314192533493042,
                },
                {
                  X: 0.2697678208351135,
                  Y: 0.14317971467971802,
                },
              ],
              score: 95.6135025024414,
              pageNumber: 5,
            },
            value: {
              boundingBox: {
                Width: 0.1383630782365799,
                Height: 0.011495685204863548,
                Left: 0.33536967635154724,
                Top: 0.12971559166908264,
              },
              polygon: [
                {
                  X: 0.33536967635154724,
                  Y: 0.12982212007045746,
                },
                {
                  X: 0.4737169146537781,
                  Y: 0.12971559166908264,
                },
                {
                  X: 0.47373276948928833,
                  Y: 0.1411048024892807,
                },
                {
                  X: 0.33538496494293213,
                  Y: 0.14121128618717194,
                },
              ],
              score: 95.6135025024414,
              pageNumber: 5,
            },
          },
          source: "processedResults.json",
          score: 95.6135025024414,
        },
        {
          key: "MASTER:",
          value: "AGREEMENT for Sale and Purchase",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 5,
            key: {
              boundingBox: {
                Width: 0.0822325274348259,
                Height: 0.011544244363904,
                Left: 0.30074796080589294,
                Top: 0.7493422031402588,
              },
              polygon: [
                {
                  X: 0.30074796080589294,
                  Y: 0.7494041323661804,
                },
                {
                  X: 0.3829649090766907,
                  Y: 0.7493422031402588,
                },
                {
                  X: 0.38298049569129944,
                  Y: 0.7608245015144348,
                },
                {
                  X: 0.30076321959495544,
                  Y: 0.7608864307403564,
                },
              ],
              score: 94.88622283935547,
              pageNumber: 5,
            },
            value: {
              boundingBox: {
                Width: 0.30613699555397034,
                Height: 0.011829587630927563,
                Left: 0.392505019903183,
                Top: 0.7490938305854797,
              },
              polygon: [
                {
                  X: 0.392505019903183,
                  Y: 0.7493244409561157,
                },
                {
                  X: 0.6986249685287476,
                  Y: 0.7490938305854797,
                },
                {
                  X: 0.6986420154571533,
                  Y: 0.7606929540634155,
                },
                {
                  X: 0.39252081513404846,
                  Y: 0.760923445224762,
                },
              ],
              score: 94.88622283935547,
              pageNumber: 5,
            },
          },
          source: "processedResults.json",
          score: 94.88622283935547,
        },
        {
          key: "Ref:",
          value: "LEG/PRO/10729/ZBS",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 5,
            key: {
              boundingBox: {
                Width: 0.03308206796646118,
                Height: 0.011176721192896366,
                Left: 0.39068475365638733,
                Top: 0.734359085559845,
              },
              polygon: [
                {
                  X: 0.39068475365638733,
                  Y: 0.7343840003013611,
                },
                {
                  X: 0.4237515330314636,
                  Y: 0.734359085559845,
                },
                {
                  X: 0.4237668514251709,
                  Y: 0.7455108761787415,
                },
                {
                  X: 0.39069995284080505,
                  Y: 0.7455357909202576,
                },
              ],
              score: 95.44139862060547,
              pageNumber: 5,
            },
            value: {
              boundingBox: {
                Width: 0.17961539328098297,
                Height: 0.011615438386797905,
                Left: 0.429561972618103,
                Top: 0.7340656518936157,
              },
              polygon: [
                {
                  X: 0.429561972618103,
                  Y: 0.7342010140419006,
                },
                {
                  X: 0.609160840511322,
                  Y: 0.7340656518936157,
                },
                {
                  X: 0.6091773509979248,
                  Y: 0.7455458045005798,
                },
                {
                  X: 0.4295777380466461,
                  Y: 0.74568110704422,
                },
              ],
              score: 95.44139862060547,
              pageNumber: 5,
            },
          },
          source: "processedResults.json",
          score: 95.44139862060547,
        },
        {
          key: "AGREEMENT",
          value:
            "For the sale and purchase of 1-12 Archway Heights 16 Archway Road London N19",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 5,
            key: {
              boundingBox: {
                Width: 0.15986183285713196,
                Height: 0.010866770520806313,
                Left: 0.4197734296321869,
                Top: 0.3889903724193573,
              },
              polygon: [
                {
                  X: 0.4197734296321869,
                  Y: 0.38911232352256775,
                },
                {
                  X: 0.5796198844909668,
                  Y: 0.3889903724193573,
                },
                {
                  X: 0.5796352624893188,
                  Y: 0.3997352123260498,
                },
                {
                  X: 0.4197881519794464,
                  Y: 0.39985713362693787,
                },
              ],
              score: 94.16653442382812,
              pageNumber: 5,
            },
            value: {
              boundingBox: {
                Width: 0.4211043417453766,
                Height: 0.04149524122476578,
                Left: 0.28913769125938416,
                Top: 0.4187832474708557,
              },
              polygon: [
                {
                  X: 0.28913769125938416,
                  Y: 0.4191041588783264,
                },
                {
                  X: 0.7101812958717346,
                  Y: 0.4187832474708557,
                },
                {
                  X: 0.7102420330047607,
                  Y: 0.4599580466747284,
                },
                {
                  X: 0.28919222950935364,
                  Y: 0.4602784812450409,
                },
              ],
              score: 94.16653442382812,
              pageNumber: 5,
            },
          },
          source: "processedResults.json",
          score: 94.16653442382812,
        },
        {
          key: "London Borough of Haringey",
          value: "Alexandra House 10 Station Road Wood Green London N22 7TR",
          locations: {
            fileName: "processedResults.json",
            pageNumber: 5,
            key: {
              boundingBox: {
                Width: 0.2367350161075592,
                Height: 0.014438188634812832,
                Left: 0.3816719353199005,
                Top: 0.6439542770385742,
              },
              polygon: [
                {
                  X: 0.3816719353199005,
                  Y: 0.6441332697868347,
                },
                {
                  X: 0.6183863878250122,
                  Y: 0.6439542770385742,
                },
                {
                  X: 0.6184069514274597,
                  Y: 0.6582136154174805,
                },
                {
                  X: 0.3816913068294525,
                  Y: 0.6583924889564514,
                },
              ],
              score: 73.93769836425781,
              pageNumber: 5,
            },
            value: {
              boundingBox: {
                Width: 0.14306753873825073,
                Height: 0.056360334157943726,
                Left: 0.42809945344924927,
                Top: 0.65927654504776,
              },
              polygon: [
                {
                  X: 0.42809945344924927,
                  Y: 0.6593846082687378,
                },
                {
                  X: 0.5710868239402771,
                  Y: 0.65927654504776,
                },
                {
                  X: 0.5711669921875,
                  Y: 0.7155290246009827,
                },
                {
                  X: 0.42817676067352295,
                  Y: 0.7156368494033813,
                },
              ],
              score: 73.93769836425781,
              pageNumber: 5,
            },
          },
          source: "processedResults.json",
          score: 73.93769836425781,
        },
      ]);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ paddingTop: "8rem" }}>
      <div>
        {loading && (
          <div>
            <Container className="mt-5">
              <Row>
                <Col className="text-center">
                  <Spinner animation="border" />
                </Col>
              </Row>
            </Container>
          </div>
        )}
        {!loading && (
          <div>
            <Container className="mt-5">
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Case Documents</Card.Title>
                      <hr />
                      {/* <div className="mb-2">
                        {docApiData!.urls.map((doc, index) => (
                          <Button
                            className="rounded-circle m-2"
                            onClick={() => {
                              updateExtractionData(index);
                              setDocumentData(docApiData!.urls[index].original);
                              setDocNo(index);
                            }}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div> */}
                      {/* <Card.Subtitle className="mb-2 text-muted">
                        <iframe
                          title="pdf-viewer"
                          src={documentData}
                          width="700"
                          height="600"
                        ></iframe>
                      </Card.Subtitle> */}
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        Case Information{" "}
                        <Button
                          style={{ backgroundColor: "#CF7650", border: "none" }}
                          onClick={() => {
                            setEditCaseDetails(!editCaseDetails);
                          }}
                        >
                          Edit
                        </Button>
                      </Card.Title>
                      <hr />
                      {!editCaseDetails && (
                        <div>
                          <Card.Subtitle className="mb-2 text-muted">
                            Client Name: {caseInfo?.clientName.S}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Nature: {caseInfo?.nature.S}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Date: {caseInfo?.date.S}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Status: {caseInfo?.status.S}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Assignee: {caseInfo?.assignee.S}
                          </Card.Subtitle>
                          <hr />
                          <Card.Subtitle className="mb-2 text-muted">
                            Client ID: {caseInfo?.clientId.S}
                          </Card.Subtitle>
                        </div>
                      )}
                      {editCaseDetails && (
                        <div>
                          <Form>
                            <Form.Group controlId="formClientName">
                              <Form.Label>Client Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="clientName"
                                placeholder="Enter client name"
                                value={caseEditInfo.clientName.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formNature">
                              <Form.Label>Nature</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter nature"
                                defaultValue={caseEditInfo.nature.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formDate">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                type="date"
                                defaultValue={caseEditInfo.date.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formStatus">
                              <Form.Label>Status</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter status"
                                defaultValue={caseEditInfo.status.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formAssignee">
                              <Form.Label>Assignee</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter assignee"
                                defaultValue={caseEditInfo.assignee.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <Form.Group controlId="formClientId">
                              <Form.Label>Client ID</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter client ID"
                                defaultValue={caseEditInfo.clientId.toString()}
                                onChange={handleCaseEditChange}
                              />
                            </Form.Group>
                            <div className="text-center">
                              <Button
                                className="m-2"
                                style={{
                                  backgroundColor: "#CF7650",
                                  border: "none",
                                }}
                                onClick={() => {
                                  submitCaseEdit(caseEditInfo);
                                }}
                              >
                                Submit
                              </Button>
                            </div>
                          </Form>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>Document Extractions</Card.Title>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Page Number</th>
                            <th>Score</th>
                            <th>Source</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractionData!.map((result: ExtractionResult) => (
                            <tr>
                              <td>{result.key}</td>
                              <td>{result.value}</td>
                              <td>{result.locations.pageNumber}</td>
                              <td>{result.score}</td>
                              <td>{result.source}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col className="mt-5">
                  <Card>
                    <Card.Body>
                      <Card.Title>Case Description</Card.Title>
                      <hr />
                      <Card.Subtitle className="mb-2 text-muted">
                        {caseInfo?.description.S}
                      </Card.Subtitle>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </div>
    </div>
  );
};

export default Case;
