import { app } from "./index";
import { API_PORT } from "./constants";

app.listen(API_PORT, () => {
    console.info(`Server started on localhost: ${API_PORT}`);
});
