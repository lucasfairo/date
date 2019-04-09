import { merge, forEach } from 'lodash';
import getTheme from 'native-base/src/theme/components';

export default (variables => ({
  ...variables,
  ...merge(getTheme(variables), {
    'NativeBase.Container': {
      backgroundColor: variables.backgroundColor,
    },

    'Sparkle.TouchableOpacity': {
      '.disabled': {
        opacity: 0.3,
      },

      'NativeBase.Icon': {},

      '.primary': {
        'NativeBase.Text': {
          color: variables.brandPrimary,
        }
      }
    },

    'NativeBase.Fab': {
      'NativeBase.Icon': {
        color: '#000000',
      },

      backgroundColor: variables.highlightColor,
      elevation: 5,
    },

    'NativeBase.ViewNB': {
      '.padder': {
        padding: variables.contentPadding,
      },

      '.horizontalPadder': {
        paddingHorizontal: variables.contentPadding,
      },

      '.verticalPadder': {
        paddingVertical: variables.contentPadding,
      },

      '.highlight': {
        backgroundColor: variables.highlightColor,
      },

      '.background': {
        backgroundColor: variables.backgroundColor,
      },

      '.foreground': {
        backgroundColor: variables.foregroundColor,
      },
    },

    'NativeBase.Item': {
      '.last': {
        borderWidth: 0,
      }
    },

    'NativeBase.Thumbnail': {
      width: 40,
      height: 40,
      borderRadius: 8,

      '.small': {
        width: 32,
        height: 32,
        borderRadius: 6,
      },

      '.large': {
        borderRadius: 8,
        height: 168,
        width: 168,
      },
    },

    'NativeBase.Button': {
      elevation: 0,
      height: 50,

      'Sparkle.Spinner': {
        position: 'absolute',
        right: variables.contentPadding,
        color: '#FFFFFF',
      },

      'NativeBase.Text': {
        fontSize: 16,
        fontWeight: '500',
      },

      '.primary': {
        '.disabled': {
          backgroundColor: '#5F96F2',
          opacity: 0.5,
        },
      },

      '.transparent': {
        '.secondary': {
          backgroundColor: null,
        },

        '.disabled': {
          backgroundColor: null,
          opacity: 0.3,
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

        'NativeBase.Icon': {
          color: variables.textColor,
        },

        '.bordered': {
          'NativeBase.Text': {
            color: variables.textColor,
          },

          'NativeBase.Icon': {
            color: variables.textColor,
          },
        },

        '.transparent': {
          'NativeBase.Text': {
            color: variables.textColor,
          },
        }
      },
    },

    'NativeBase.H1': {
      fontWeight: '500',
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.H2': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.H3': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.Text': {
      '.inverse': {
        color: variables.inverseTextColor,
      },
    },

    'NativeBase.Header': {
      'NativeBase.Body': {
        alignItems: 'center',
      },
    },

    'NativeBase.ListItem': {
      '.searchBar': {
        paddingHorizontal: variables.listItemPadding + 5,
        backgroundColor: 'transparent',

        'NativeBase.Item': {
          padding: 10,
          borderRadius: variables.borderRadiusBase,
          backgroundColor: variables.toolbarInputColor,
          shadowColor: '#E1E6ED',
          shadowRadius: 4,
          shadowOpacity: 1,
          shadowOffset: {
            width: 0,
            height: 0,
          },

          'NativeBase.Icon': {
            color: '#BDC0CB',
            fontSize: 18,
          },
        },
      },

      'NativeBase.Body': {
        'NativeBase.Text': {
          '.headline': {
            lineHeight: 20,
            marginBottom: 5,
          },
        },
      },

      'NativeBase.Right': {
        'NativeBase.Text': {
          '.headline': {
            lineHeight: 20,
            marginBottom: 5,
          },
        },

        'NativeBase.Badge': {
          height: null,
          minWidth: 20,
          paddingHorizontal: 3,

          'NativeBase.Text': {
            fontSize: 12,
            lineHeight: 20,
          },
        },
      },
    },

    'NativeBase.Card': {
      borderWidth: 0,

      'NativeBase.CardItem': {
        padding: 0,

        '.header': {
          alignItems: 'center',

          'NativeBase.Text': {
            fontWeight: null,
            color: '#BDC0CB',
          },

          'NativeBase.Icon': {
            width: 30,
            fontSize: 20,
            color: '#BDC0CB',
          },
        },

        '.padder': {
          padding: variables.contentPadding,
        },

        '.horizontalPadder': {
          paddingHorizontal: variables.contentPadding,
        },

        '.highlight': {
          backgroundColor: variables.highlightColor,
        },

        '.background': {
          backgroundColor: variables.backgroundColor,
        },
  
        '.foreground': {
          backgroundColor: variables.foregroundColor,
        },

        '.cardBody': {
          flexDirection: 'column',
        }
      },

      '.topBorder': {
        borderTopWidth: variables.borderWidth,
      },
    },

    'Sparkle.Divider': {},

    'Sparkle.Shadow': {},

    'Sparkle.ScreenHeader': {
      header: {
        backgroundColor: variables.foregroundColor,
      },

      'NativeBase.Icon': {
        fontSize: 35,
        color: '#BDC0CB',
        margin: 7,
      },

      'Sparkle.TouchableOpacity': {
        'NativeBase.Text': {
          color: '#BDC0CB',
        },

        paddingHorizontal: variables.contentPadding,
      },
    },


    'Sparkle.SearchBar': {
      inputWrap: {
        backgroundColor: variables.highlightColor,
      },
    },

    'Sparkle.TabBar': {
      backgroundColor: variables.foregroundColor,
    },

    'Sparkle.BottomTabBar': {
      root: {
        backgroundColor: variables.foregroundColor,
      },
    },

    'Sparkle.ChatFooter': {
      root: {
        backgroundColor: variables.foregroundColor,
      },
    },

    'Sparkle.NoContent': {
      'NativeBase.ViewNB': {
        backgroundColor: variables.placeholderColor,
      },
    
      '.inverted': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.foregroundColor,
        },
      },
    },

    /**
     * Placeholders
     * TODO: Think of a better approach ( more generic - less hardcoded )
     */
    'Sparkle.ChatListItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ListItem': {
          'NativeBase.Left': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },
    
          'NativeBase.Body': {
            'NativeBase.Text': {
              backgroundColor: variables.placeholderColor,
            },
          },
        },
      },
    },

    'Sparkle.FieldSection': {
      'Sparkle.Placeholder': {
        'NativeBase.Card': {
          'NativeBase.CardItem': {
            '.header': {
              'NativeBase.Text': {
                backgroundColor: variables.placeholderColor,
              },
            },
    
            '.cardBody': {
              'NativeBase.ViewNB': {
                backgroundColor: variables.placeholderColor,
              },
            },
          },
        },
      },
    },

    'Sparkle.PhotoListItem': {
      'Sparkle.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'Sparkle.UserAvatar': {
      'Sparkle.Placeholder': {
        backgroundColor: variables.placeholderColor,
      },
    },

    'Sparkle.UserHeading': {
      'NativeBase.ViewNB': {
        'Sparkle.UserAvatar': {
          'Sparkle.Placeholder': {
            backgroundColor: variables.backgroundColor,
          },
        },
      },
    },

    'Sparkle.UserListItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ListItem': {
          'NativeBase.Left': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },
    
          'NativeBase.Body': {
            'NativeBase.ViewNB': {
              backgroundColor: variables.placeholderColor,
            },
          },
        },
      },
    },

    'Sparkle.UsersRowItem': {
      'Sparkle.Placeholder': {
        'NativeBase.ViewNB': {
          backgroundColor: variables.highlightColor,
        },
      },
    },
  }),
}));
