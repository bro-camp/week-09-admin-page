import express, { Express } from 'express';
import { engine } from 'express-handlebars';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';

import nocache from 'nocache';
import { viewsDirPath, publicDirPath } from '#global/paths';
import { indexRouter } from '#routers/index-router';
import { userRouter } from '#routers/user/user-router';
import { userAuthRouter } from '#routers/user/user-auth-router';
import { userLogoutRouter } from '#routers/user/user-logout-router';
import { userIsAuthorizedRouter } from '#routers/user/user-is-authorized';
import { homeRouter } from '#routers/home-router';
import { adminPanelRouter } from '#routers/admin/admin-panel-router';
import { adminAuthRouter } from '#routers/admin/admin-auth-router';
import { adminLogoutRouter } from '#routers/admin/admin-logout-router';
import { apiV1UsersRouter } from '#routers/api/v1/api-v1-users-router';
import { sessionStore } from '#global/session-store';
import {
  redirectIfNotAuthAdmin,
  redirectIfAuthAdmin,
} from '#middlewares/redirections/admin-redirection-middleware';
import {
  redirectIfAuthUser,
  redirectIfNotAuthUser,
} from '#middlewares/redirections/user-redirection-middleware';

const setupApp = (app: Express) => {
  app.engine(
    'handlebars',
    engine({
      defaultLayout: false,
      // defaultLayout: `${viewsDirPath}/layouts/main`,
      // layoutsDir: `${viewsDirPath}/layouts`,
      partialsDir: `${viewsDirPath}/partials`,
    }),
  );
  app.set('view engine', 'handlebars');
  app.set('views', viewsDirPath);
  app.set('etag', false);

  app.use(nocache());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    session({
      secret: 'Key that will sign cookie',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    }),
  );

  app.use('/public', express.static(publicDirPath));
  app.use('/', indexRouter);
  app.use('/home', redirectIfNotAuthUser, homeRouter);
  app.use('/admin/panel', redirectIfNotAuthAdmin, adminPanelRouter);
  app.use('/admin/auth', redirectIfAuthAdmin, adminAuthRouter);
  app.use('/admin/logout', redirectIfNotAuthAdmin, adminLogoutRouter);
  app.use('/api/v1/users', redirectIfNotAuthAdmin, apiV1UsersRouter);
  app.use('/user', userRouter);
  app.use('/user/auth', redirectIfAuthUser, userAuthRouter);
  app.use('/user/logout', redirectIfNotAuthUser, userLogoutRouter);
  app.use('/user/is-authorized', userIsAuthorizedRouter);

  // catch 404 and forward to error handler
  app.use((req, _res, next) => {
    if (req.app.get('env') === 'development') next(createError(404));
    else next();
  });

  app.use((_req, res) => {
    res.status(404);
    res.render(`${viewsDirPath}/pages/error`, {
      errorType: '404',
      errorMessage: 'Not Found',
    });
  });
};

const startApp = (app: Express, PORT: string | number) => {
  const server = app.listen(PORT, () => {
    console.log(
      `\n\n* EXPRESS : Server started on http://localhost:${PORT}\n\n`,
    );
  });

  return server;
};

const onMongooseConnected = (dbUrl: string, PORT: string | number) => {
  console.log('* MONGOOSE: Default connection is open at', dbUrl);
  const app = express();
  setupApp(app);
  const server = startApp(app, PORT);

  const cleanup = (signal: string) => {
    console.log('\n\n');
    console.log(`* ${signal} signal received.`);

    console.log('* EXPRESS: Closing HTTP server.');
    server.close((serverErr) => {
      if (serverErr) {
        console.log(`\n\nSERVER ERROR: ${serverErr}`);
        process.exit(serverErr ? 1 : 0);
      }
      console.log('* EXPRESS: HTTP server closed.');
    });

    console.log('* MONGOOSE: Closing connection.');
    mongoose.connection.close();
  };

  process.on('SIGINT', () => cleanup('SIGINT'));
  process.on('SIGTERM', () => cleanup('SIGTERM'));
};

export const setupAndStartMongoWithApp = (
  dbUrl: string,
  PORT: string | number,
) => {
  console.log('\n\n* MONGOOSE: Connecting...');

  mongoose
    .connect(dbUrl)
    .then(() => {
      console.log('* MONGOOSE: Connected');
    })
    .catch((err) => console.log(`\n\n* MONGOOSE: ${err}`));

  mongoose.connection
    .on('connected', () => onMongooseConnected(dbUrl, PORT))
    .on('disconnected', () => {
      console.log('* MONGOOSE: Default connection is disconnected');
    })
    .on('error', (err) => {
      console.log(
        `\n\n* MONGOOSE: Default connection has occured an error:\nError: ${err}`,
      );
    })
    .on('close', () => {
      console.log('* MONGOOSE: Connection closed.');
    });
};
