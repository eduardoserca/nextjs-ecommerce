import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

import Swal from 'sweetalert2';

export default function Categories(){
    const [editedCategory, setEditedCategory] = useState(null);

    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(()=>{
        fetchCategories();
    }, []);

    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        });
    }

    async function saveCategory(ev){
        ev.preventDefault();
        
        const data = {name, parentCategory};

        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data);            
        }
                
        setName('');
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    function deleteCategory(category){
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete!',
            reverseButtons: true
          }).then(async result => {

            if (result.isConfirmed) {
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();

              Swal.fire(
                'Deleted!',
                `The category ${category.name} has been deleted.`,
                'success'
              )
            }
          })
    }


    return(
        <Layout>
            <h1>Categories</h1>
            <label>
                {editedCategory ? `Edit category ${editedCategory.name}` 
                :'New category name'}
            </label>

            <form onSubmit={saveCategory} className="flex gap-1">
                <input 
                    className="nb-0" 
                    type="text" 
                    placeholder={'Category name'} 
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
                
                <select 
                    onChange={ev=>setParentCategory(ev.target.value)}
                    value={parentCategory}>
                    <option value="0">No parent category</option>
                    {
                        categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))
                    }                    
                </select>

                <button 
                    type="submit" 
                    className="btn-primary py-1">Save</button>
            </form>

            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button
                                        onClick={() => editCategory(category)}
                                        className="btn-default mr-1"
                                        >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteCategory(category)}
                                        className="btn-red">Delete</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
        </Layout>        
    );
}