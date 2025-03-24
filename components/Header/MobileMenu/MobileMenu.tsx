// components/MobileMenu.tsx
import Link from 'next/link'
import { MenuItem } from '@/Types/type'
import { ChevronDown } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'

interface MobileMenuProps {
  items: MenuItem[]
}

export default function MobileMenu({ items }: MobileMenuProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Accordion type="single" collapsible className="text-xl">
        {items.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <AccordionItem value={`item-${item.id}`} className="border-none">
                <AccordionTrigger className="px-4 py-3 text-xl font-normal hover:no-underline">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  {item.children?.map((child: any) => (
                    <div key={child.id}>
                      {child.children ? (
                        <Accordion type="single" collapsible className="mt-1">
                          <AccordionItem value={`child-${child.id}`} className="border-none">
                            <AccordionTrigger className="px-2 py-2 text-xl font-normal hover:no-underline">
                              {child.title}
                            </AccordionTrigger>
                            <AccordionContent className="pl-6">
                              {child.children.map((grandchild: any) => (
                                <div key={grandchild.id} className="py-1">
                                  {grandchild.link ? (
                                    <Link href={grandchild.link} className="block text-gray-600 hover:text-blue-600 text-xl">
                                      {grandchild.title}
                                    </Link>
                                  ) : (
                                    <span className="text-xl">{grandchild.title}</span>
                                  )}
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <div className="py-2 pl-2">
                          {child.link ? (
                            <Link href={child.link} className="block text-gray-600 hover:text-blue-600 text-xl">
                              {child.title}
                            </Link>
                          ) : (
                            <span className="text-xl">{child.title}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ) : (
              <div className="px-4 py-3">
                {item.link ? (
                  <Link href={item.link} className="block text-gray-800 hover:text-blue-600 text-xl">
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-xl">{item.title}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </Accordion>
    </div>
  )
}