import { merge, forEach } from 'lodash';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'NativeBase.Container': {
      backgroundColor: '#FFFFFF',
    },

    'NativeBase.ViewNB': {
      ".padder": {
        padding: variables.contentPadding
      },

      ".horizontalPadder": {
        paddingHorizontal: variables.contentPadding
      },

      '.highlight': {
        backgroundColor: '#F8F9FB',
      },
    },

    'NativeBase.Thumbnail': {
      '.small': {
        borderRadius: 4,
      },

      '.large': {
        borderRadius: 8,
      },

      width: 40,
      height: 40,
      borderRadius: 8,
    },

    'NativeBase.Button': {
      'NativeBase.Text': {
        fontWeight: '500',
      },

      '.transparent': {
        '.secondary': {
          backgroundColor: null,
        }
      },

      '.bordered': {
        '.secondary': {
          backgroundColor: null,
        }
      },

      '.light': {
        'NativeBase.Text': {
          color: variables.textColor,
        },
      },

      '.secondary': {
        borderColor: '#BDC0CB',
        backgroundColor: variables.brandLight,

        'NativeBase.Text': {
          color: variables.textColor,
        },

        '.bordered': {
          'NativeBase.Text': {
            color: variables.textColor,
          },
        },

        '.transparent': {
          'NativeBase.Text': {
            color: variables.textColor,
          },
        }
      },

      elevation: 0,
      height: 50,
    },

    'NativeBase.H1': {
      fontWeight: '500',
      '.inverse': {
        color: variables.inverseTextColor,
      }
    },

    'NativeBase.H2': {
      '.inverse': {
        color: variables.inverseTextColor,
      }
    },

    'NativeBase.H3': {
      '.inverse': {
        color: variables.inverseTextColor,
      }
    },

    'NativeBase.Text': {
      '.inverse': {
        color: variables.inverseTextColor,
      }
    },

    'NativeBase.Header': {
      'NativeBase.Body': {
        alignItems: 'center',
      },
    },

    'NativeBase.ListItem': {
      '.searchBar': {
        'NativeBase.Item': {
          backgroundColor: variables.toolbarInputColor,
          borderRadius: variables.borderRadiusBase,
          padding: 10,

          shadowColor: '#E1E6ED',
          shadowRadius: 4,
          shadowOpacity: 1,
          shadowOffset: {
            width: 0,
            height: 0,
          },

          'NativeBase.Icon': {
            color: '#BDC0CB',
          },
        },
        paddingHorizontal: variables.listItemPadding + 5,
        backgroundColor: 'transparent',
      },
    },

    'NativeBase.Card': {
      'NativeBase.CardItem': {
        padding: 0,

        '.header': {
          'NativeBase.Text': {
            fontWeight: null,
            color: '#BDC0CB',
          },

          'NativeBase.Icon': {
            color: '#BDC0CB',
            fontSize: 20,
            width: 30,
          },

          alignItems: 'center',
        }
      },

      '.topBorder': {
        borderTopWidth: variables.borderWidth,
      },

      borderWidth: 0,
      marginBottom: 16,
    },

    'Sparkle.Divider': {},

    'Sparkle.UserListItem': {
      'NativeBase.ListItem': {
        'NativeBase.Body': {
          height: 68,
          justifyContent: 'center'
        },
        'NativeBase.Right': {
          justifyContent: 'center',
        },
      }
    }
  }),
}));
