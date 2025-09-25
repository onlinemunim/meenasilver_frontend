import { Country } from "./country";
import { States } from "./States";

export interface Cities {
  id: number;
  name: string;
  state: States;
  country: Country;
}
