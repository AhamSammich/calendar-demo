import { createApp } from "vue";
import { createPinia } from "pinia";
import { Locale } from 'vant';
import enUS from 'vant/es/locale/lang/en-US';

// Set language
Locale.use('en-US', enUS);

// Import Vant components
import { 
    Button,
    Toast,
    Loading,
    Form,
    Field,
    Cell,
    CellGroup,
    Popup,
    PickerGroup,
    TimePicker,
    Calendar,
    Dialog,
    Notify,
    Empty
} from "vant";

// Import styles
import "./style.css";
import 'vant/lib/index.css';

import router from "./router";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app
    // Register Pinia state management
    .use(pinia)

    // Register Vue Router instance
    .use(router)

    // Register Vant components
    .use([Button])
    .use(Toast)
    .use(Loading)
    .use(Form)
    .use(Field)
    .use(Cell)
    .use(CellGroup)
    .use(Popup)
    .use(PickerGroup)
    .use(TimePicker)
    .use(Calendar)
    .use(Dialog)
    .use(Notify)
    .use(Empty)


    .mount("#app");
