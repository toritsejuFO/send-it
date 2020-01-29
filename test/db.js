import chai from 'chai';
import chaiHTTP from 'chai-http';
import DB from '../dist/db';

chai.use(chaiHTTP);
chai.should();