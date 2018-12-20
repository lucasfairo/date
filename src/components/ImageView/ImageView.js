import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StatusBar, Modal, Text, View } from 'react-native';
import { Badge, Spinner } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { propType as graphqlPropType } from 'graphql-anywhere';
import moment from 'moment';

import { withStyleSheet as styleSheet, connectToStyleSheet } from 'theme';
import BackButton from '../BackButton';
import Icon from '../Icon';
import UserOnlineStatus from '../UserOnlineStatus';
import TouchableOpacity from '../TouchableOpacity';
import ImageComments from '../ImageComments';

const SpinnerContainer = connectToStyleSheet('spinnerContainer', View);
const ModalContent = connectToStyleSheet('modalContent', View);
const Header = connectToStyleSheet('header', View);
const Indicator = connectToStyleSheet('indicator', Text);
const Footer = connectToStyleSheet('footer', View);
const NameBlock = connectToStyleSheet('nameBlock', View);
const Name = connectToStyleSheet('name', Text);
const Caption = connectToStyleSheet('caption', Text);
const DateTime = connectToStyleSheet('dateTime', Text);
const ActionsBlock = connectToStyleSheet('actionsBlock', View);
const ActionText = connectToStyleSheet('actionText', Text);
const ActionBadge = connectToStyleSheet('actionBadge', Badge);
const ActionBadgeText = connectToStyleSheet('actionBadgeText', Text);

const photoCommentsTotalCountQuery = gql`
  query photoCommentsTotalCountQuery($id: ID!) {
    photo: node(id: $id) {
      ...on Photo {
        id
        comments {
          ...on PhotoCommentsConnection {
            totalCount
          }
        }
      }
    }
  }
`;

@styleSheet('Sparkle.ImageView', {
  spinnerContainer: {
    margin: 'auto',
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    // @TODO: use mixin
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    height: Dimensions.get('window').height - StatusBar.currentHeight,
    width: Dimensions.get('window').width,
  },

  header: {
    position: 'absolute',
    zIndex: 1000,
  },

  indicator: {
    width: '100%',
    position: 'absolute',
    top: 10,
    textAlign: 'center',
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
    zIndex: 999,
  },

  footer: {
    paddingTop: 25,
    paddingBottom: 29,
    paddingHorizontal: 17,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(46, 48, 55, 0.3)',
  },

  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    paddingRight: 7,
    fontFamily: 'SF Pro Text',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.06,
    lineHeight: 19,
    color: '#FFFFFF',
  },

  caption: {
    paddingTop: 10,
    paddingBottom: 19,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#FFFFFF',
  },

  dateTime: {
    paddingBottom: 19,
    fontFamily: 'SF Pro Text',
    fontSize: 14,
    lineHeight: 17,
    color: '#BDC0CB',
  },

  actionsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderTopWidth: 1,
    borderTopColor: 'rgba(189, 192, 203, 0.5)',
  },

  actionButton: {
    flexDirection: 'row',
  },

  buttonComments: {
    marginRight: 31,
  },

  actionIcon: {
    marginRight: 8,
    fontSize: 16,
    color: '#C5CAD1',
  },

  actionText: {
    color: '#AFB2BF',
    fontSize: 14,
    fontFamily: 'SF Pro Text',
  },

  actionBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
    marginTop: 2,
    height: 16,
    backgroundColor: '#BDC0CB',
  },

  actionBadgeText: {
    paddingVertical: 0,
    fontSize: 12,
    lineHeight: 58,
    color: '#FFFFFF',
  },
})
export default class ImageView extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    images: PropTypes.array.isRequired, // @TODO
    photoCommentsTotalCountQuery: graphqlPropType(photoCommentsTotalCountQuery),
  };

  static queries = {
    photoCommentsTotalCountQuery,
  };

  state = {
    index: 0,
    visible: false,
  };

  onShowImage(index) {
    this.setState({ index, visible: true });
  }

  onChange(index) {
    this.setState({ index });
  }

  onClose() {
    this.setState({ visible: false });
  }

  renderHeader() {
    return (
      <Header>
        <BackButton onPress={::this.onClose} />
      </Header>
    );
  }

  renderIndicator(currentIndex, allSize) {
    return allSize > 1 ? <Indicator>{`${currentIndex} of ${allSize}`}</Indicator> : null;
  }

  renderFooter() {
    const { images, styleSheet: styles } = this.props;
    const { index } = this.state;
    const {
      id,
      caption,
      createdAt,
      user: {
        name,
        isOnline, // @TODO
      },
      totalCountLikes, // @TODO
    } = images[index];
    const date = moment.duration(moment(createdAt).diff(moment())).humanize();
    const dateFormatted = `${date.charAt(0).toUpperCase()}${date.slice(1)} ago`;

    return (
      <Footer>
        <View>
          <NameBlock>
            <Name>{name}</Name>
            <UserOnlineStatus isOnline={isOnline} />
          </NameBlock>
          <Caption>{caption}</Caption>
          <DateTime>{dateFormatted}</DateTime>
        </View>

        <ActionsBlock>
          <Query query={photoCommentsTotalCountQuery} variables={{ id }}>
            {({ loading, data: { photo } }) => (loading ? null : ( // @TODO: add spinner
              <ImageComments photoId={id} totalCount={photo.comments.totalCount}>
                {onShowImageComments => (
                  <TouchableOpacity
                    onPress={onShowImageComments}
                    style={[styles.actionButton, styles.buttonComments]}
                  >
                    <Icon name="chats-bar" style={styles.actionIcon} />
                    <Text style={styles.actionText}>Comment</Text>
                    {!photo.comments.totalCount ? null : (
                      <Badge style={styles.actionBadge}>
                        <Text style={styles.actionBadgeText}>{photo.comments.totalCount}</Text>
                      </Badge>
                    )}
                  </TouchableOpacity>
                )}
              </ImageComments>
            ))}
          </Query>

          <TouchableOpacity onPress={() => alert('Like')} style={styles.actionButton}>
            <Icon name="cancel" style={styles.actionIcon} />
            <ActionText>Like</ActionText>
            {totalCountLikes ? (
              <ActionBadge>
                <ActionBadgeText>{totalCountLikes}</ActionBadgeText>
              </ActionBadge>
            ) : null}
          </TouchableOpacity>
        </ActionsBlock>
      </Footer>
    );
  }

  render() {
    const { children, images } = this.props;
    const { index, visible } = this.state;

    return (
      <Fragment>
        {children(::this.onShowImage)}

        <Modal
          visible={visible}
          animationType="fade"
          onRequestClose={::this.onClose}
          transparent
        >
          <ModalContent>
            <ImageViewer
              imageUrls={images}
              index={index}
              onChange={::this.onChange}
              onSwipeDown={::this.onClose}
              renderHeader={::this.renderHeader}
              renderIndicator={this.renderIndicator}
              renderFooter={::this.renderFooter}
              failImageSource={{ uri: 'https://thewindowsclub-thewindowsclubco.netdna-ssl.com/wp-content/uploads/2018/06/Broken-image-icon-in-Chrome.gif' /* @TODO */ }}
              loadingRender={() => <SpinnerContainer><Spinner /></SpinnerContainer>}
              footerContainerStyle={{ width: '100%' }}
              backgroundColor="rgba(46, 48, 55, 0.95)"
            />
          </ModalContent>
        </Modal>
      </Fragment>
    );
  }
}
