import { fetcher} from "./client";



export const fetchRefrences = async () => {
    return fetcher("/references");
}