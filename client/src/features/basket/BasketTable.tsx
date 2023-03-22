import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAppSelector } from "../../app/store";
import BasketItem from "./BasketItem";

function BasketTable() {
	const { basket } = useAppSelector((state) => state.basket);
	return (
		<TableContainer>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Product</TableCell>
						<TableCell align="right">Quantity</TableCell>
						<TableCell align="right">Total Price</TableCell>
						<TableCell align="right"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{[...basket?.basketItems!]
						.sort((a, b) => a.id - b.id)
						.map((item, index) => (
							<BasketItem item={item} key={index} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default BasketTable;
