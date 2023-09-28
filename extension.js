module.exports = {
    "name": "Student Account",
    "publisher": "ADA University",
    "cards": [{
        "type": "StudentAccountCard",
        "source": "./src/cards/StudentAccountCard",
        "title": "Student Account",
        "displayCardType": "Student Account Information",
        "description": "This Card shows students' account balance",
        "configuration": {
          "client": [{
            "key": "buttonUrl",
            "label": "Account Balance button redirect URL",
            "type":"url",
            "required":true
          },
          {
            "key": "currency",
            "label": "Currency to show balances",
            "type":"text",
            "required":true
          }]
        },
        "queries": {
            "list-charges": [{
                "resourceVersions": {
                    "studentCharges": { min: 16 },
                    "persons": { min: 12 }
                },
                "query": `query getStudentCharges($personId:ID)
                {
                  studentCharges16(
                    filter : {
                        student12:{id:{EQ:$personId}}
                      })
                  {
                    edges {
                      node {
                        chargedAmount {
                          amount {
                            value
                          }
                        }
                      }
                    }
                  }
                }`
            }],
            "list-payments": [{
                "resourceVersions": {
                    "studentPayments": { min: 16 },
                    "persons": { min: 12 }
                },
                "query":`query getStudentPayments($personId:ID){
                    studentPayments16(filter: {student12:{id:{EQ:$personId}}}) {
                        edges {
                            node {
                                amount{
                                    value
                                }
                            }
                        }
                    }
                }`
            }]
        }
    }]
}