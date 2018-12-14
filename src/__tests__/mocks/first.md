```javascript
import { create, m } from 'https://cdn.jsdelivr.net/npm/switzerland@latest/es/production/index.js';

create('x-countries', m.vdom(({ h }) =>
    h('ul', {}, [
        h('li', {}, 'UK'),
        h('li', {}, 'RU'),
        h('li', {}, 'JP')
    ])
));
```
