import React from 'react';
import clsx from 'clsx';

import styles from './ConversationCard.module.scss';
import whiteBlockStyles from '../WhiteBlock/WhiteBlock.module.scss';
import Avatar from 'react-avatar';
import { Room } from '../../api-types';

export const ConversationCard: React.FC<Room> = ({ title, speakers, listenersCount }) => {
  return (
    <div className={clsx(whiteBlockStyles.block, styles.card)}>
      <h4 className={styles.title}>{title}</h4>
      <div className={clsx('d-flex mt-10', styles.content)}>
        <div className={styles.avatars}>
          {speakers.map((speaker, i) => (
            <Avatar
              round
              key={i}
              size="45px"
              src={speaker.avatarUrl}
              className={speakers.length > 1 && i === speakers.length - 1 ? styles.lastAvatar : ''}
            />
          ))}
        </div>
        <div className={clsx(styles.info, 'ml-30')}>
          <ul className={styles.guests}>
            {speakers.map((speaker, i) => (
              <li className={clsx(styles.listItem)} key={speaker.id}>
                {speaker.fullname}
                {/* <img className="ml-5" src={speaker.avatarUrl} alt="Cloud" width={14} height={14} /> */}
              </li>
            ))}
          </ul>
          <ul className={styles.details}>
            <li className={styles.listItem}>
              <img
                className="mr-5"
                src="/static/user.png"
                alt="Users count"
                width={12}
                height={12}
              />
              {listenersCount}
            </li>
            <li className={clsx(styles.listItem, 'ml-10')}>
              <img
                className="mr-5"
                src="/static/message.png"
                alt="Message"
                width={15}
                height={15}
              />
              {speakers.length}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
