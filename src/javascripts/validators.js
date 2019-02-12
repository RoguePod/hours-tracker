import * as Yup from 'yup';

Yup.addMethod(Yup.number, 'parsedTime', (message) => {
  return Yup.number().nullable()
    .test('parsedTime', message, (value) => {
      return value !== -1;
    });
});
