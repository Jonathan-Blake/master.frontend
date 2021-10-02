# Feature: Transaction Page
#     Transaction page loads data as expected.

# Scenario: Goto Transaction From Home Page
#     Given I am on the home page.
#     And I log in.
#     And I click the buy button.
#     Then the "initial_load" should appear in 0.1 seconds.
#     Then the "data_load" should appear in 0.1 seconds.
#   Examples:
#     | initial_load                   | data_load                       |
#     | \/\/*[@id='transactionForm']   | \/\/*[@id='stockPriceCard']     |

# Scenario: Goto Transaction From Portfolio
#     Given I am on the portfolio page.
#     And I click the buy button.
#     Then the "initial_load" should appear in 0.1 seconds.
#     Then the "data_load" should appear in 0.1 seconds.
#   Examples:
#     | initial_load                   | data_load                       |
#     | \/\/*[@id='transactionForm']   | \/\/*[@id='stockPriceCard']     |

