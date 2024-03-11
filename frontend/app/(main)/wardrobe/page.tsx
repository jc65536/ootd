import ClothingItemCardList from './clothing-item-card-list';
import "./clothing-item.css";

export default function Home() {
    return (
        <>  
            <div className='wardrobe-header'>My Wardrobe</div>
            <ClothingItemCardList></ClothingItemCardList>
        </>
    );
}
