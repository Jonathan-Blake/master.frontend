Feature: Portfolio Page
    Home page loads data as expected.

Scenario: Goto Portfolio From Home Page
    Given I am on the home page.
    And I log in.
    And I click the profile button.
    Then the "<initial_load>" should appear in 0.1 seconds.
    Then the "<data_load>" should appear in 0.1 seconds.

  Examples:
    | initial_load                   | data_load                       |
    | \/\/*[@id='stockPriceDisplay'] | \/\/*[@id='stockPriceCard']     |