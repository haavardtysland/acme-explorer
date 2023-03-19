import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();

addFormats(ajv);

ajv.addFormat('number', {
  type: 'string',
  validate: (x: string) => !isNaN(parseFloat(x)) && !isNaN(+x),
});

export default ajv;
