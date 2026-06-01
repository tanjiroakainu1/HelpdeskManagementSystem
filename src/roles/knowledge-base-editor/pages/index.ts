import type { ComponentType } from 'react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import CreateArticles from './CreateArticles';
import EditArticles from './EditArticles';
import Faqs from './Faqs';
import Categories from './Categories';
import PublishArticles from './PublishArticles';
import UpdateArticles from './UpdateArticles';

export const pages: Record<string, ComponentType> = {
  'dashboard': Dashboard,
  profile: Profile,
  'create-articles': CreateArticles,
  'edit-articles': EditArticles,
  'faqs': Faqs,
  'categories': Categories,
  'publish-articles': PublishArticles,
  'update-articles': UpdateArticles,
};
