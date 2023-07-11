import { createApp } from "vue";
import { createPinia } from "pinia";

// Import Vant components
import { 
    Button,
    Toast,
    Loading,
    Form,
    Field,
    CellGroup,
    PickerGroup,
    TimePicker,
    Calendar,
    Dialog,
    Notify
} from "vant";

// Import styles
import "./style.css";
import 'vant/lib/index.css';

import router from "./router";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Register Vant components
app.use(Button);
app.use(Toast);
app.use(Loading);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(PickerGroup);
app.use(TimePicker);
app.use(Calendar);
app.use(Dialog);
app.use(Notify);


app.mount("#app");
