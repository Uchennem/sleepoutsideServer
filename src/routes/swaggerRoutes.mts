import  { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swaggerDesign.json' with { type: 'json' }; 

const router: Router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default router;