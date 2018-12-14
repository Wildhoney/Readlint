```javascript
import parse from 'django-exceptions';

const data = Promise.resolve([
    { field: 'name', message: 'Cannot be empty.' },
    { field: 'email', message: 'Invalid e-mail.' }
]);

data.then(data => {
    parse(data).forEach(({ field, messages }) => {
        console.log('Field:', field);
        console.log('Messages:', messages);
    });
});
```
