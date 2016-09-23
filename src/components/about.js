
import React from 'react'
import DocumentTitle from 'react-document-title'


export function About(props) {
  return (
    <DocumentTitle title={`Σχετικά — Ερωτήσεις Κυπρίων Βουλευτών`}>
      <div className="__about">
        <h2>Σχετικά</h2>
        <p>
          Η εφαρμογή δημιουργήθηκε από το <i>openpatata</i>, μια άτυπη
          πρωτοβουλία για τη διαφάνεια στην κυπριακή νομοθετική εξουσία.
          Συλλέγοντας και διαμορφώνοντας κοινοβουλευτικές πληροφορίες
          σε ανοικτά δεδομένα και μετέπειτα σε ελεύθερες εφαρμογές φιλοδοξούμε
          να συνεισφέρουμε στην κίνηση προς την κοινωνική ανοικτογένεση.
        </p>
        <p>
          Μπορείτε να βρείτε τον <a href="https://github.com/openpatata/question-viewer"
            rel="external">πηγαίο κώδικα</a> στο GitHub, όπως και όλα
          τα <a href="https://github.com/openpatata/openpatata-data"
            rel="external">δεδομένα</a> που χρησιμοποιούνται σε μηχαναγνώσιμη
          μορφή.
        </p>
      </div>
    </DocumentTitle>
  )
}
