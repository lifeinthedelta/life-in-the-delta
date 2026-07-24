HOW TO ADD THIS SECTION TO LIVING IN THE DELTA

FILES INCLUDED
- crew-section.html
- crew-section.css
- preview.html

INSTALLATION
1. Open your current website's index.html file.
2. Copy everything inside crew-section.html.
3. Paste it above the closing </main> tag, or above the footer.
4. Upload crew-section.css into the same folder as index.html.
5. Add this line inside the <head> area of index.html:
   <link rel="stylesheet" href="crew-section.css">
6. Change the button link from href="#" to your contact form, email, Facebook page, or application link.

PHOTOS
The section currently uses JH and DB initials as clean placeholders.
To use real photos, replace:
<div class="crew-photo">JH</div>

with:
<img class="crew-real-photo" src="images/jase-herrin.jpg" alt="Jase Herrin">

Then add this to crew-section.css:
.crew-real-photo {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

NAVIGATION
To add the section to your navigation menu, use:
<a href="#crew">Crew</a>


JOIN OUR CREW APPLICATION PAGE
- Upload join-the-crew.html, crew-application.css, and crew-application.js into the same folder as index.html.
- The crew button is already linked to join-the-crew.html.
- When someone submits the form, their email app opens with the completed application addressed to deltahouseproductions@outlook.com.
- Because this is a static GitHub Pages website, the visitor must press Send in their email app.
