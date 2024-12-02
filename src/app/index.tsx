import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { Product } from "@/components/product";
import { useCartStore } from "@/stores/cart-store";
import { CATEGORIES, MENU } from "@/utils/data/products";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, SectionList, Text, View } from "react-native";

export default function Home () {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const cartStore = useCartStore()

  const sectionListRef = useRef<SectionList>(null) 

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    )

    if(sectionListRef.current){
      sectionListRef.current.scrollToLocation({
        animated: true,
        sectionIndex,
        itemIndex: 0,
      })
    }
  }

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  
  return (
      <View className="flex-1 pt-8">
        <Header title="Faça seu pedido" cartQuantityItems={cartQuantityItems} />

        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryButton
              title={item}
              isSelected={item === category}
              onPress={() => handleCategorySelect(item)}
            />
          )}
          horizontal
          className="max-h-10 mt-5 pb-10"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}
        />
      
        <SectionList
          ref={sectionListRef}
          sections={MENU}  
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={false}
          renderItem={({ item }) => (
            <Link 
              href={{
                pathname: '../product/[id]',
                params: { id: `${item.id}` }
              }}>
              <Product data={ item } />
            </Link>
          )}
          renderSectionHeader={({ section: { title } }) =>  (
            <Text className="text-xl text-white mt-5 font-heading mb-3">
              { title }
            </Text>
          )}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 100, paddingLeft: 20 }}  
        />
    </View>
  )
}