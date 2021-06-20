import { DTOModel } from 'pl-core-ui-lib';
import { IEventFields } from '../model/eventFields';

class EventFieldsDTO extends DTOModel<IEventFields> {
    public name: string = 'event-fields';
}

export const eventFieldsDTO = new EventFieldsDTO();
