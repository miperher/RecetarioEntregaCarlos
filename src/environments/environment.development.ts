export const environment = {
    production: false,
    firebaseConfig : {
        apiKey: "AIzaSyDW4otTBC1bBWLsIAWXieMsmDZDx1DihQw",
        authDomain: "recetario-8ac04.firebaseapp.com",
        projectId: "recetario-8ac04",
        storageBucket: "recetario-8ac04.firebasestorage.app",
        messagingSenderId: "176475294234",
        appId: "1:176475294234:web:4827b82a0b04a287ff1fa3",
        measurementId: "G-W5EXNYGSNS"
      },
    api:{
        nationalities:'https://www.themealdb.com/api/json/v1/1/list.php?a=list',
        categories:'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
        listByCategory: 'https://www.themealdb.com/api/json/v1/1/filter.php?c=',
        listByNationality: 'https://www.themealdb.com/api/json/v1/1/filter.php?a=',
        viewRecipe:'https://www.themealdb.com/api/json/v1/1/lookup.php?i='
    }
    
};
