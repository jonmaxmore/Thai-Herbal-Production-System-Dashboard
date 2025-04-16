
import { useState } from "react";
import { ShoppingCart, Check, Filter, Search } from "lucide-react";
import HerbTraceLayout from "@/components/layouts/HerbTraceLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { herbList } from "@/utils/herbData";
import { useToast } from "@/hooks/use-toast";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{id: string; name: string; quantity: number; price: number}[]>([]);
  const { toast } = useToast();

  // Convert herb list to marketplace items
  const marketplaceItems = herbList.map(herb => ({
    id: herb.id,
    name: herb.name,
    description: herb.scientificName || herb.name,
    price: Math.floor(Math.random() * 500) + 100,
    stock: Math.floor(Math.random() * 50) + 5,
    image: "https://via.placeholder.com/150",
    rating: Math.floor(Math.random() * 5) + 1
  }));

  // Filter items based on search term
  const filteredItems = marketplaceItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item: typeof marketplaceItems[0]) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? {...cartItem, quantity: cartItem.quantity + 1} 
          : cartItem
      ));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.name,
        quantity: 1,
        price: item.price
      }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <HerbTraceLayout activeTab="marketplace">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-green-800">Herbal Marketplace</h2>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search herbs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0 relative">
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="object-cover h-full w-full"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="font-bold text-green-700">฿{item.price}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-sm text-muted-foreground">
                    Stock: {item.stock}
                  </div>
                  <div className="flex">
                    {Array(5).fill(0).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < item.rating ? "text-yellow-500" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  onClick={() => addToCart(item)} 
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </HerbTraceLayout>
  );
}
