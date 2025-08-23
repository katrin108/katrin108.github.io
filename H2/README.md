1. Breytið sýniforritinu gasket1 á heimasíðu kennslubókarinnar á eftirfarandi hátt:
        i. Í stað þess að fyrsti punkturinn sé í miðju þríhyrningsins, látið hann vera vel fyrir
        utan þríhyrninginn, t.d. í (100, 100).
        Breytti : 
            var p = scale( 0.25, add( u, v ) );
        í 
            var p = vec2(100,100)

        sem setur fyrsta punkt á [100,100]


        ii. Aukið punktastærðina með því að setja 3.0 í breytuna gl_PointSize í
        hnútalitaranum.
            Breytti : 
                gl_PointSize = 1.0;
            í 
                gl_PointSize = 3.0;



        iii. Fækkið teiknuðum punktum niður í 100 (efst í JS skránni).
        Keyrið svo forritið nokkrum sinnum ("refresh" í vafra) og berið saman útkomuna. Segið frá
        útkomunni í nokkrum orðum. Skilið líka einni skjámynd og hlekk á forritið

            Breytti : 
                var NumPoints = 5000;
            í 
                var NumPoints = 100;


2. 
 
