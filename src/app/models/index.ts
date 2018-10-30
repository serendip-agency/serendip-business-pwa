export interface widgetInterface {
    id?: string;
    component: string;
    inputs?: any;
}

export interface tabInterface {
    active?: boolean;
    widgets?: widgetInterface[];
    icon?: string;
    title?: string;
}

export interface containerInterface {

    showTabs?: boolean;
    tabs: tabInterface[];
}


export interface gridInterface {

    containers: containerInterface[]

}


export interface widgetCommandInterface {

    command: 'openWidget' | 'refreshWidget';
    documentId?: string;
    icon?: string;
    component?: string;
    title?: string;
    screen?: 'desktop' | 'mobile';

}


export let periodUnits = [
    { label: 'دقیقه', value: 'minute' },
    { label: 'ساعت', value: 'hour' },
    { label: 'روز', value: 'day' },
    { label: 'ماه', value: 'month' },
    { label: 'سال', value: 'year' }
]

export let currencies = ['ریال', 'تومان', 'دلار', 'یورو', 'یوآن'];


// gridLayout: { containers: { tabs: { active: boolean, widgets: { id: string } [] } [] } [] } = {
//     containers: []
// };
