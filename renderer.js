window.addEventListener('message', async (event) => {
    if (event.data.type === 'start-parsing') {
      const { loginGPRO, passwordGPRO, loginWRT, passwordWRT } = event.data;
  
      try {
        const dataFromPuppeteer = await startPuppeteer(loginGPRO, passwordGPRO, loginWRT, passwordWRT);
  
        // Wyślij dane z powrotem do webview za pomocą zdarzenia "message"
        window.parent.postMessage({ type: 'parsing-complete', data: dataFromPuppeteer }, '*');
      } catch (error) {
        // Wyślij informację o błędzie z powrotem do webview za pomocą zdarzenia "message"
        window.parent.postMessage({ type: 'parsing-error', errorMessage: error.message }, '*');
      }
    }
  });
  
  async function startPuppeteer(loginGPRO, passwordGPRO, loginWRT, passwordWRT) {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
      // Strona GPRO
      await page.goto('https://gpro.net/gb/gpro.asp');
    
      // Wprowadź dane logowania na stronie GPRO
      await page.type('input[name="textLogin"]', loginGPRO);
      await page.type('input[name="textPassword"]', passwordGPRO);
    
      // Kliknij przycisk logowania na stronie GPRO
      await page.click('input[name="LogonFake"]');
    
      // Poczekaj na zalogowanie i przejście na stronę z danymi na stronie GPRO
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    
      // Teraz wykonaj odpowiednie akcje na stronie GPRO, aby wyciągnąć dane i spój je w odpowiednią całość
      const dataFromPage1 = await page.evaluate(() => {
        // Tutaj użyj JavaScript do wyciągnięcia danych z DOM strony GPRO
        // np.:
        const dataElement = document.querySelector('.data-element');
        const data = dataElement ? dataElement.innerText : null;
        return data;
      });
    
      // Zamknij stronę GPRO
      await page.close();
    
      // Strona WRT
      const page2 = await browser.newPage();
      await page2.goto('URL_STRONA_2');
    
      // Wprowadź dane logowania na stronie WRT
      await page2.type('input[name="username"]', loginWRT);
      await page2.type('input[name="password"]', passwordWRT);
    
      // Kliknij przycisk logowania na stronie WRT
      await page2.click('button[type="submit"]');
    
      // Poczekaj na zalogowanie i przejście na stronę z danymi na stronie WRT
      await page2.waitForNavigation({ waitUntil: 'domcontentloaded' });
    
      // Teraz wykonaj odpowiednie akcje na stronie WRT, aby wyciągnąć dane i spój je w odpowiednią całość
      const dataFromPage2 = await page2.evaluate(() => {
        // Tutaj użyj JavaScript do wyciągnięcia danych z DOM strony WRT
        // np.:
        const dataElement = document.querySelector('.data-element');
        const data = dataElement ? dataElement.innerText : null;
        return data;
      });
    
      // Zamknij stronę WRT
      await page2.close();
    
      // Zamknij przeglądarkę
      await browser.close();
    
      // Zwróć dane ze stron GPRO i WRT
 
    return {
      dataFromPage1: 'Dane ze strony 1',
      dataFromPage2: 'Dane ze strony 2',
    };
}