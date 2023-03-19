import { Picture } from "../Picture";
import { Stage } from "../Stage";

export type UpdateTripDto = {
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  stages: Stage[];
  pictures?: Picture[];
  requirements: string[];
  isPublished: boolean;
}