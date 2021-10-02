# Feature: Home Page
#     Home page loads data as expected.


# Scenario: Goto Home When Unauthenticated
#     Given I am on the home page.
#     Then the "<initial_load>" should appear in 0.1 seconds.
#     Then the "<data_load>" should appear in 0.1 seconds.
#   Examples:
#     | initial_load                   | data_load                       |
#     | \/\/*[@id='stockPriceDisplay'] | \/\/*[@id='stockPriceCard']     |

# Scenario: Goto Home When Authenticated
#     Given I am on the home page.
#     And I log in.
#     Then the "<initial_load>" should appear in 0.1 seconds.
#     Then the "<data_load>" should appear in 0.1 seconds.
#     And the buy and sell buttons should appear.
#   Examples:
#     | initial_load                   | data_load                       |
#     | \/\/*[@id='stockPriceDisplay'] | \/\/*[@id='stockPriceCard']     |
