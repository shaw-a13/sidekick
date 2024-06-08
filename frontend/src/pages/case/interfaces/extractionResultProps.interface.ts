export interface ExtractionResultProps {
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
