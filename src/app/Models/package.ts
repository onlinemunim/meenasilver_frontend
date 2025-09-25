interface Component {
 name: string,
 price: number
}

export interface Package {
  id: number;
  name: string;
  description: string;
  components: Component[];
  total_amount: number;
  creator_id: number;
  approval_id: number | null;
  min_amount: number;
  status: string;

}
