import { expect, test } from "@playwright/test";
import { chromium } from "playwright";

let browser;
let context;
let page;
const data = [
  { name: "Bob", age: 20, gender: "male" },
  { name: "George", age: 42, gender: "male" },
  { name: "Sara", age: 42, gender: "female" },
  { name: "Conor", age: 40, gender: "male" },
  { name: "Jennifer", age: 42, gender: "female" },
];

test.describe("Dynamic Table", async () => {
  test.beforeAll(async () => {
    // Launch a new browser instance
    browser = await chromium.launch();
    //new context
    context = await browser.newContext({
      recordVideo: {
        dir: "videos/",
        size: { width: 1280, height: 720 },
      }, // Directory to store videos4
    });

    page = await context.newPage();
    // Navigate to a website
    await page.goto(
      "https://testpages.herokuapp.com/styled/tag/dynamic-table.html"
    );
  });

  // test("check GET response", async ({ request }) => {
  //   const response = await request.get(
  //     "https://testpages.herokuapp.com/styled/tag/dynamic-table.html"
  //   );
  //   console.log(response.status());
  //   expect(response.status()).toBe(200);
  // });

  test("expand table button -> insert text area with provided data -> click Refresh Table button -> should update table", async () => {
    // click on "Table Data" button to expand the below section
    await page.locator("text=Table Data").click();

    // text-area id="jsondata" should be visible
    const textArea = page.locator('[id="jsondata"]');
    expect(await textArea.isVisible()).toBeTruthy();

    // insert text area with provided data
    await textArea.fill(`${JSON.stringify(data)}`);
    expect(await textArea.inputValue()).toContain(`${JSON.stringify(data[0])}`);

    // click "Refresh Table" button
    await page.locator('[id="refreshtable"]').click();

    // after click, the table should be populated with new data
    // new table header "gender" should be added
    const tableHeaders = await page
      .locator('[id="dynamictable"] tr th')
      .allInnerTexts();
    expect(tableHeaders).toContain("gender");

    // assert table data with test provided data, both should match
    const names = await page
      .locator('[id="dynamictable"] tr td:nth-child(1)')
      .allInnerTexts();
    const ages = await page
      .locator('[id="dynamictable"] tr td:nth-child(2)')
      .allInnerTexts();
    const genders = await page
      .locator('[id="dynamictable"] tr td:nth-child(3)')
      .allInnerTexts();

    const storedData = JSON.parse(await textArea.inputValue());
    storedData.map((obj) => {
      expect(names).toContain(`${obj.name}`);
      expect(ages).toContain(`${obj.age}`);
      expect(genders).toContain(`${obj.gender}`);
    });
  });

  test.afterAll(async () => {
    // Close the browser
    await browser.close();
  });
});
